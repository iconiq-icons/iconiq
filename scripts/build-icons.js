const { spawnSync } = require('child_process');
const path = require('path');

// Run a command and log its output
function runCommand(command, args, cwd = process.cwd()) {
  console.log(`Running: ${command} ${args.join(' ')}`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  if (result.status !== 0) {
    console.error(`Command failed with status: ${result.status}`);
    process.exit(1);
  }

  return result;
}

// Main build process
async function buildIcons() {
  try {
    console.log('🚀 Starting iconiq build process');

    // 1. Generate core icon exports
    console.log('\n📦 Generating core icon exports');
    runCommand('node', ['scripts/generate-core-icons.js']);

    // 2. Generate React components
    console.log('\n📦 Generating React components');
    runCommand('node', ['scripts/generate-react-components.js']);

    // 3. Optimize SVG paths (would normally happen here)
    console.log('\n🔧 SVG optimization skipped in this demo');

    // 4. Build all packages
    console.log('\n📦 Building all packages');
    runCommand('npm', ['run', 'build']);

    console.log('\n✅ Build completed successfully!');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
}

// Run the build
buildIcons();
