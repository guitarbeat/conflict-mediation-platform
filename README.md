# Co-op Conflict Resolution Platform

An interactive web application designed to help co-op members work through interpersonal conflicts using a structured, evidence-based mediation process.

## 🌟 Features

### Core Functionality
- **6-Step Guided Process**: Based on ICC Austin's proven conflict mediation framework
- **Individual Reflection**: Private spaces for each party to process thoughts and emotions
- **Shared Discussion**: ABCDE cognitive behavioral model for structured conversation
- **Solution Development**: Miracle question technique and compromise building
- **Agreement Documentation**: Action steps and follow-up planning

### Enhanced Emotion Expression
- **Draggable Valence-Arousal Chart**: Interactive emotion mapping with smooth animations
- **Emotion Word Selection**: 30+ emotion words for precise feeling identification
- **Dual Data Capture**: Separate tracking of chart positions and selected words
- **Visual Feedback**: Real-time emotion summary cards

### Professional Design
- **Co-op Branding**: Custom color palette and logo integration
- **Dark/Light Mode**: Complete theme switching with user preference storage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Stylish Separators**: Animated gradient sections with floating titles
- **Guidance Alerts**: Clear instructions for each step of the process

### Export & Documentation
- **Professional PDF Export**: Comprehensive session summaries with proper formatting
- **JSON Data Export**: Raw data for further analysis or integration
- **Complete Records**: All inputs, emotions, and agreements captured

## 🚀 Live Demo

**Website**: [https://myqraxlm.manussite.space](https://myqraxlm.manussite.space)

## 🛠️ Technology Stack

- **Frontend**: React 19 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: GSAP for smooth draggable interactions
- **PDF Generation**: jsPDF with custom formatting
- **Build Tool**: Vite for fast development and optimized builds
- **Package Manager**: pnpm for efficient dependency management

## 📋 Installation & Setup

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Quick Start
```bash
# Clone the repository
git clone https://github.com/guitarbeat/conflict-mediation-platform.git
cd conflict-mediation-platform

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### Development Commands
```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
```

## 🎯 Usage Guide

### For Mediators
1. **Setup**: Enter party names and conflict details
2. **Individual Reflection**: Guide each party through private reflection
3. **Shared Discussion**: Facilitate ABCDE model conversation
4. **Solution Development**: Help parties explore possibilities
5. **Agreement**: Document action steps and follow-up plans
6. **Export**: Generate PDF records for co-op files

### For Participants
- Use both emotion expression methods for complete emotional mapping
- Take time with individual reflection before shared discussion
- Focus on "I" statements and personal experiences
- Be open to understanding the other person's perspective

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Custom branding
VITE_COOP_NAME="Your Co-op Name"
VITE_LOGO_URL="/path/to/your/logo.png"
```

### Customization
- **Colors**: Update `src/App.css` CSS variables
- **Logo**: Replace `src/assets/logo.png`
- **Content**: Modify guidance text in `src/components/GuidanceAlert.jsx`

## 📚 Mediation Framework

Based on ICC Austin's interpersonal conflict mediation process:

1. **Intrapersonal Processing**: Individual thoughts, feelings, and communication approaches
2. **ABCDE Model**: Activating event → Beliefs → Consequences → Disputations → Effects
3. **Solution-Focused Approach**: Miracle question and perspective-taking
4. **Collaborative Agreement**: Mutual needs identification and action planning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **ICC Austin** for the mediation framework and worksheets
- **Co-op Community** for feedback and testing
- **Radix UI** and **shadcn/ui** for excellent component libraries
- **GSAP** for smooth animation capabilities

## 📞 Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

---

*Built with ❤️ for cooperative communities*

