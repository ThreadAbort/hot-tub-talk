# 🛁 Hot Tub Talk

A delightful web component for embedding hot-tub-style conversations in your HTML and Markdown documents. Perfect for sharing wild thoughts and ideas in a bubbly, swirling hot tub UI. 

## ✨ Features

- 🌊 WebGL-powered water physics with realistic ripples
- 🌙 Beautiful night-time ambiance with twinkling stars
- 💨 Dynamic water jets and steam effects
- 🖱️ Interactive water effects that respond to mouse movement
- 📱 Responsive design that works on all devices
- ⚡ Optimized performance with hardware acceleration
- 🎨 Customizable appearance and behavior

## 📦 Installation

```bash
npm install hot-tub-talk
```

## 🚀 Usage

### In HTML

```html
<!-- Import the component -->
<script type="module">
  import 'hot-tub-talk';
</script>

<!-- Use the component -->
<hot-tub-talk>
  Is the universe a simulation? 🌌
  Here's the evidence:
  - The Mandela Effect 🤯
  - Déjà vu 🔄
  - Glitches in the Matrix 🐱‍💻
</hot-tub-talk>
```

### In Markdown

```markdown

```hot-tub-talk
What if our dreams are glimpses into parallel universes? 😴
Evidence:

- That weird dream where you're late for a test 📚
- Flying dreams (past lives as birds?) 🦅
- Dream characters with their own agendas 🤔
```

### In React

```jsx
import { HotTubTalk } from 'hot-tub-talk';

function App() {
  return (
    <HotTubTalk>
      Is consciousness just a simulation? 🤔
      Let's discuss...
    </HotTubTalk>
  );
}
```

## ⚙️ Configuration

You can customize the hot tub behavior by passing options:

```javascript
const options = {
  resolution: 512,      // Water simulation resolution
  dropRadius: 15,       // Size of water drops
  perturbance: 0.02,    // How much the water moves
  interactive: true,    // Enable mouse interaction
  crossOrigin: ''       // CORS setting for images
};

// Apply to an existing element
document.querySelector('hot-tub-talk').configure(options);
```

## 🎨 Styling

The component uses CSS custom properties for easy styling:

```css
hot-tub-talk {
  --hot-tub-talk-background: rgba(30, 136, 229, 0.15);
  --hot-tub-talk-text-color: white;
  --hot-tub-talk-ripple-color: rgba(255, 255, 255, 0.2);
  --hot-tub-talk-steam-opacity: 0.4;
  --hot-tub-talk-border-radius: 20px;
}
```

## 🔧 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with WebGL support

## 🤝 Contributing

We love contributions! Please check out our [Contributing Guide](CONTRIBUTING.md) for guidelines.

## 📝 License

[MIT](LICENSE) © Hue and Aye

## 🙏 Acknowledgments

Special thanks to:

- Trisha from Accounting for her endless enthusiasm
- The WebGL Ripple Effect community
- All our contributors and users

## 📚 Documentation

For detailed documentation, visit our [Documentation Site](https://hot-tub-talk.docs.com).

## 🐛 Troubleshooting

### Common Issues

1. **WebGL not supported**
   - The component will fallback to CSS-only effects
   - Check browser compatibility

2. **Performance Issues**
   - Try reducing the resolution option
   - Disable interactive mode on mobile devices

3. **CORS Issues with Images**
   - Set appropriate crossOrigin option
   - Ensure images are served with correct headers

## 💡 Tips

- Use emojis to make your hot tub talks more expressive
- Keep content concise for best visual effect
- Experiment with different background colors
- Consider night mode for best ambiance

## 🔄 Updates

Check our [CHANGELOG.md](CHANGELOG.md) for latest updates and improvements.
