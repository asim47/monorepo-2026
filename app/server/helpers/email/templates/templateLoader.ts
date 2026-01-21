import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../../../utils/logger';

const templatesDir = join(__dirname, './');

export async function readTemplate(
  templateName: string,
  data: Record<string, string | number> = {},
): Promise<string> {
  try {
    const templatePath = join(templatesDir, `${templateName}.html`);
    let template = readFileSync(templatePath, 'utf-8');

    // Replace template variables with data
    // Supports {{variableName}} syntax
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, String(data[key]));
    });

    return template;
  } catch (error) {
    logger.error(`Failed to load template: ${templateName}`, error);
    throw new Error(`Template ${templateName} not found or could not be loaded`);
  }
}
