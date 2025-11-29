import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { Libro } from '../../models/libro.model';
import { Nl2brPipe } from '../../pipes/nl2br.pipe';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Nl2brPipe ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: Message[] = [
    {
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de SmartLibrary. Puedo ayudarte a:\n\n📚 Buscar libros por tema, autor o categoría\n⏰ Consultar horarios y políticas\n💡 Darte recomendaciones personalizadas\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ];

  input: string = '';
  isLoading: boolean = false;
  libros: Libro[] = [];
  shouldScroll: boolean = false;

  sugerencias: string[] = [
    '¿Qué libros sobre bullying tienen?',
    '¿Cuál es el horario?',
    'Recomiéndame algo de ciencia ficción',
    '¿Cuántos libros puedo prestar?'
  ];

  constructor(private libraryService: LibraryService) {}

ngOnInit(): void {
  this.libros = this.libraryService.getLibros();
  console.log('Libros cargados:', this.libros.length);
}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.input.trim() || this.isLoading) return;

    const userMessage = this.input.trim();
    this.input = '';

    // Agregar mensaje del usuario
    this.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    this.shouldScroll = true;
    this.isLoading = true;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: this.buildPrompt(userMessage)
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let assistantMessage = '';
      if (data.content && Array.isArray(data.content)) {
        assistantMessage = data.content
          .filter((block: any) => block.type === 'text')
          .map((block: any) => block.text)
          .join('\n');
      }

      if (!assistantMessage) {
        assistantMessage = 'Lo siento, no pude generar una respuesta. ¿Podrías reformular tu pregunta?';
      }

      this.messages.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });
      this.shouldScroll = true;

    } catch (error) {
      console.error('Error completo:', error);
      this.messages.push({
        role: 'assistant',
        content: '❌ Lo siento, tuve un problema conectándome. Por favor intenta de nuevo en un momento.',
        timestamp: new Date()
      });
      this.shouldScroll = true;
    } finally {
      this.isLoading = false;
    }
  }

  buildPrompt(userMessage: string): string {
    const catalogoSimplificado = this.libros.map(libro => ({
      titulo: libro.titulo,
      autor: libro.autor,
      categoria: libro.categoria,
      sinopsis: libro.descripcion || libro.sinopsis || 'Sin descripción',
      disponible: libro.disponible
    }));

    return `Eres "BiblioBot", el asistente virtual de SmartLibrary. Eres amigable, útil y conoces bien la biblioteca.

CATÁLOGO DE LIBROS (${this.libros.length} libros):
${JSON.stringify(catalogoSimplificado, null, 2)}

INFORMACIÓN DE LA BIBLIOTECA:
- Horario: Lunes a Viernes 8:00 AM - 8:00 PM, Sábados 9:00 AM - 5:00 PM
- Límite de préstamos: 5 libros por usuario
- Duración del préstamo: 15 días con opción a renovar
- Política de multas: $2 por día de atraso

INSTRUCCIONES:
- Responde de forma clara, amigable y concisa
- Si buscas libros, recomienda máximo 3 y menciona si están disponibles
- Usa emojis ocasionalmente para hacer la conversación más amigable
- Si no tienes información exacta, sugiere alternativas del catálogo
- Mantén las respuestas en español y usa un tono casual pero profesional

PREGUNTA DEL USUARIO:
${userMessage}

RESPUESTA (máximo 300 palabras):`;
  }

  useSugerencia(sugerencia: string): void {
    this.input = sugerencia;
    this.sendMessage();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    if (confirm('¿Estás seguro de que quieres limpiar el chat?')) {
      this.messages = [
        {
          role: 'assistant',
          content: '¡Hola de nuevo! 👋 ¿En qué puedo ayudarte?',
          timestamp: new Date()
        }
      ];
      this.shouldScroll = true;
    }
  }
}
