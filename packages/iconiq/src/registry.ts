import { IconData } from '@iconiq/shared';

/**
 * Registry for storing and retrieving icon data
 */
export class IconRegistry {
  private icons: Map<string, IconData>;

  /**
   * Create a new IconRegistry instance
   */
  constructor() {
    this.icons = new Map();
  }

  /**
   * Register an icon in the registry
   *
   * @param name - The name of the icon
   * @param data - The icon data to register
   */
  register(name: string, data: IconData): void {
    this.icons.set(name, data);
  }

  /**
   * Check if an icon exists in the registry
   *
   * @param name - The name of the icon to check
   * @returns True if the icon exists, false otherwise
   */
  has(name: string): boolean {
    return this.icons.has(name);
  }

  /**
   * Get icon data from the registry
   *
   * @param name - The name of the icon to retrieve
   * @returns The icon data
   * @throws Error if the icon is not found
   */
  get(name: string): IconData {
    const iconData = this.icons.get(name);
    if (!iconData) {
      throw new Error(`Icon '${name}' not found in registry`);
    }
    return iconData;
  }

  /**
   * Get all registered icon names
   *
   * @returns Array of all registered icon names
   */
  getAllNames(): string[] {
    return Array.from(this.icons.keys());
  }
}
