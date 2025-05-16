import { IconData } from '@iconiq/shared';

export * from './icons';

/**
 * Get icon data by name
 *
 * @param name - The name of the icon to retrieve
 * @returns A promise that resolves to the icon data
 * @throws Error if the icon is not found
 */
export async function getIconData(name: string): Promise<IconData> {
  try {
    const iconData = await import(`../../../icons/${name}.json`);
    return iconData as IconData;
  } catch {
    throw new Error(`Icon '${name}' not found`);
  }
}

/**
 * List all available icon names
 *
 * @returns A promise that resolves to an array of all icon names
 */
export async function getAllIconNames(): Promise<string[]> {
  // This would ideally be done at build time
  // For simplicity, we're hardcoding the available icons
  return ['arrow-right', 'trash-2'];
}
