import React from 'react';
import { default as ServerIconComponent } from '@/components/ServerIconComponent';
import ClientIconComponent from '@/components/ClientIconComponent';
import IconComponent from '@/components/IconComponent';

export default async function IconsPage() {
  // Pre-render server components
  const serverIcon1 = await ServerIconComponent({
    name: 'server-icon-1',
  });

  const serverIcon2 = await ServerIconComponent({
    name: 'server-icon-2',
    size: 32,
    color: 'blue',
  });

  return (
    <div className="icons-page">
      <h1>Icons Test Page</h1>

      <section>
        <h2>Server Components</h2>
        <div className="icons-grid">
          <div className="icon-item">
            {serverIcon1}
            <p>Server Icon 1</p>
          </div>
          <div className="icon-item">
            {serverIcon2}
            <p>Server Icon 2</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Client Components</h2>
        <div className="icons-grid">
          <div className="icon-item">
            <ClientIconComponent name="client-icon-1" />
            <p>Client Icon 1 (Click me!)</p>
          </div>
          <div className="icon-item">
            <ClientIconComponent name="client-icon-2" size={32} color="red" />
            <p>Client Icon 2 (Click me!)</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Basic Components</h2>
        <div className="icons-grid">
          <div className="icon-item">
            <IconComponent name="basic-icon-1" />
            <p>Basic Icon 1</p>
          </div>
          <div className="icon-item">
            <IconComponent name="basic-icon-2" size={32} color="purple" />
            <p>Basic Icon 2</p>
          </div>
        </div>
      </section>
    </div>
  );
}
