/**
 * Triggers a browser download of a file from a Blob.
 *
 * @param content  - The file content as string or ArrayBuffer
 * @param filename - The filename for the downloaded file (e.g. 'evento.ics')
 * @param mimeType - The MIME type of the file (defaults to 'application/octet-stream')
 */
export const downloadFile = (
  content: string | ArrayBuffer,
  filename: string,
  mimeType = 'application/octet-stream'
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convenience wrapper to download an ICS (iCalendar) file.
 *
 * @param icsContent - The raw ICS string (e.g. from ICalendar.render())
 * @param filename   - The filename (defaults to 'evento.ics')
 */
export const downloadIcs = (
  icsContent: string,
  filename = 'evento.ics'
): void => {
  downloadFile(icsContent, filename, 'text/calendar;charset=utf-8');
};
