import type { DefaultOptionType } from 'antd/es/select';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
}

export function filterSelectOption(
  input: string,
  option?: DefaultOptionType,
): boolean {
  const label = option?.label ?? option?.value ?? '';
  const texto = typeof label === 'string' || typeof label === 'number'
    ? String(label)
    : '';
  const palabrasBuscadas = normalizar(input)
    .split(/\s+/)
    .filter(Boolean);
  const textoOpcion = normalizar(texto);

  return palabrasBuscadas.every((palabra) => textoOpcion.includes(palabra));
}
