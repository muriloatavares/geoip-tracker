/**
 * URL base para as chamadas de API ao backend.
 * Utiliza variável de ambiente se disponível, caso contrário aponta para o localhost padrão.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default API_BASE_URL;
