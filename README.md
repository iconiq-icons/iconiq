# iconiq

An ultra-performant SVG icon library featuring pixel-perfect, high-quality icons with adaptable styling variants.

[![npm version](https://img.shields.io/npm/v/@iconiq/react.svg?style=flat-square)](https://www.npmjs.org/package/@iconiq/react)
[![npm downloads](https://img.shields.io/npm/dm/@iconiq/react.svg?style=flat-square)](https://www.npmjs.org/package/@iconiq/react)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/yourusername/iconiq/blob/main/LICENSE)

## Features

- **Tree-shakeable**: Only import the icons you need, reducing bundle size impact
- **High Performance**: Optimized SVG paths for clean rendering and minimal file size
- **Multiple Variants**: Choose from Outline, Filled, and Sharp styles for each icon
- **Accessible**: Built-in accessibility labels for screen readers
- **Framework Agnostic**: React support now, with Vue, Web Components, and more coming soon
- **Lightweight**: Minimal bundle size impact through optimized code
- **Customizable**: Control color, size, stroke width, and more with simple props

## Installation

```bash
# With npm
npm install @iconiq/react

# With yarn
yarn add @iconiq/react

# With pnpm
pnpm add @iconiq/react
```

## Usage

### React

```jsx
// Import specific icons
import { ArrowRight, Trash2Filled, UserSharp } from '@iconiq/react';

// Usage in components
function MyComponent() {
  return (
    <div>
      <ArrowRight />
      <Trash2Filled color="red" size={32} />
      <UserSharp strokeWidth={1.5} />
    </div>
  );
}
```

### Dynamic Icons (for runtime icon selection)

```jsx
import { DynamicIcon } from '@iconiq/react';

function IconSelector({ iconName, variant = 'outline' }) {
  return <DynamicIcon name={iconName} variant={variant} fallback={<div>Icon not found</div>} />;
}
```

### Customizing Icons

```jsx
import { ArrowRight } from '@iconiq/react';

function CustomizedIcon() {
  return (
    <ArrowRight
      color="#3E63DD"
      size={36}
      strokeWidth={1.5}
      absoluteStrokeWidth
      className="my-icon-class"
      style={{ backgroundColor: '#F0F4FF' }}
    />
  );
}
```

## Icon Props

| Prop                  | Type                             | Default                | Description                          |
| --------------------- | -------------------------------- | ---------------------- | ------------------------------------ |
| `color`               | string                           | 'currentColor'         | Icon color                           |
| `size`                | number \| string                 | 24                     | Icon size in pixels                  |
| `strokeWidth`         | number \| string                 | 2                      | Width of the stroke                  |
| `absoluteStrokeWidth` | boolean                          | false                  | Whether to use absolute stroke width |
| `variant`             | 'outline' \| 'filled' \| 'sharp' | 'outline'              | Icon style variant                   |
| `a11yLabel`           | string                           | _from icon definition_ | Accessibility label                  |
| `className`           | string                           | ''                     | Additional CSS classes               |
| `style`               | object                           | {}                     | Inline styles                        |

## Development

### Requirements

- Node.js v22.15.0 or later
  - Note: If using Node.js v20.x, you may see warnings but most functionality should work
- pnpm v10.11.0 or later

### Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/iconiq.git
cd iconiq

# Install dependencies
pnpm install

# Build the packages
pnpm build

# Run tests
pnpm test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Safari iOS (latest)
- Chrome for Android (latest)

## Contributing

We welcome contributions! Please see our [contributing guidelines](./CONTRIBUTING.md) for details.

## License

Iconiq is licensed under the [MIT License](./LICENSE) and is free for commercial and personal use.
