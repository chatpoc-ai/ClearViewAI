# ClearView AI - Auto Watermark Remover

## 📋 Overview
ClearView AI is a cutting-edge web application designed to automatically detect and remove watermarks, logos, timestamps, and unwanted text overlays from images. 

Leveraging the power of **Google's Gemini 2.5 Flash Image** model, the application performs complex image reconstruction (inpainting) to fill in the areas where watermarks are removed, ensuring the background remains seamless and natural.

## ✨ Key Features

### 1. Smart Image Upload
- **Drag & Drop Support**: Intuitive interface for easy image uploading.
- **Format Support**: Compatible with JPG, PNG, and WebP formats.
- **Validation**: Automatic checks for file size (max 5MB) to ensure optimal performance.

### 2. AI-Powered Watermark Removal
- **Gemini 2.5 Integration**: Uses the latest multimodal capabilities of `gemini-2.5-flash-image`.
- **Context-Aware Inpainting**: The AI doesn't just blur the watermark; it understands the context of the image to reconstruct the texture, color, and lighting of the background behind the removed object.

### 3. Customizable Processing Controls
Users can fine-tune the AI's behavior using the **Aggressiveness Slider**:
- **Gentle (<30%)**: Best for small text or timestamps. Preserves maximum original detail.
- **Balanced (30-70%)**: The default mode, suitable for most stock photo watermarks.
- **Aggressive (>70%)**: Instructs the AI to reconstruct larger areas, useful for large, opaque logos or complex patterns.

### 4. Interactive Results Viewer
- **Before/After Comparison**: A dedicated slider component allows users to sweep across the image to compare the original vs. processed version pixel-by-pixel.
- **Zoom & Pan**: High-fidelity rendering to inspect details.

### 5. Privacy-Focused
- **Client-Side Processing**: Images are processed in memory during the session.
- **No Persistence**: Uploaded images are not stored on any backend database permanently.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (Utility-first CSS framework)
- **AI/ML**: Google GenAI SDK (`@google/genai`)
- **Model**: Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)
- **Build**: ES Modules / Vite-compatible structure

## 🚀 Getting Started

### Prerequisites
To run this application, you need a Google AI Studio API Key.

### Configuration
The application relies on the `API_KEY` environment variable. 

```typescript
// In services/geminiService.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

### Running the App
1. Clone the repository.
2. Install dependencies (if using a local bundler).
3. Set up your `.env` file with `API_KEY`.
4. Start the development server.

## 📖 Usage Guide

1. **Upload**: Drag an image onto the drop zone or click to browse.
2. **Configure**: Use the settings panel on the right to adjust the "AI Aggressiveness" if necessary.
3. **Remove**: Click the "Remove Watermark" button.
4. **Wait**: The AI processes the image (usually takes 3-10 seconds depending on complexity).
5. **Compare**: Use the slider to verify the removal quality.
6. **Download**: Click "Download Image" to save the clean version.

## ⚠️ Limitations
- **Resolution**: Very high-resolution images (4K+) may be downscaled depending on the model's current input limits.
- **Complex Patterns**: Extremely complex watermarks covering faces or detailed textures might result in minor artifacts.

## ⚖️ Legal Disclaimer
**ClearView AI** is a tool developed for educational and legitimate restoration purposes (e.g., removing timestamps from personal photos). 

**Do not use this tool to remove watermarks from copyrighted material, stock photos, or digital art that you do not own or have the license to modify.** Respect intellectual property rights.