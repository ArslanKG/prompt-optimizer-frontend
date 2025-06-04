/**
 * Simple markdown renderer for AI responses
 * Handles basic markdown syntax like **, ###, *, and `
 */

/**
 * Renders basic markdown to HTML
 * @param {string} text - The markdown text to render
 * @returns {string} - HTML string
 */
export const renderMarkdown = (text) => {
  if (typeof text !== 'string') return text;
  
  let html = text;
  
  // Handle code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Handle inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Handle bold text (**bold**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic text (*italic*)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Handle headings (### Heading)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Handle bullet points (- item or * item)
  html = html.replace(/^[\s]*[-*]\s(.*)$/gm, '<li>$1</li>');
  
  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    const items = match.match(/<li>.*?<\/li>/g);
    if (items && items.length > 0) {
      return `<ul>${items.join('')}</ul>`;
    }
    return match;
  });
  
  // Handle numbered lists (1. item)
  html = html.replace(/^[\s]*\d+\.\s(.*)$/gm, '<li>$1</li>');
  
  // Wrap consecutive numbered <li> elements in <ol>
  html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
    if (!match.includes('<ul>')) {
      const items = match.match(/<li>.*?<\/li>/g);
      if (items && items.length > 0) {
        return `<ol>${items.join('')}</ol>`;
      }
    }
    return match;
  });
  
  // Handle line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');
  
  return html;
};

/**
 * React component for rendering markdown content
 */
export const MarkdownContent = ({ content, className = '', style = {} }) => {
  const htmlContent = renderMarkdown(content);
  
  return (
    <div 
      className={className}
      style={{
        ...style,
        fontSize: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit'
      }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

const markdownRenderer = {
  renderMarkdown,
  MarkdownContent
};

export default markdownRenderer;