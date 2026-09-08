import * as XLSX from 'xlsx';
import { DiaryEntry } from './types';

/**
 * Converteert en downloadt alle dagboeknotities naar een .xlsx Excel-bestand.
 * Iedere notitie krijgt één rij met duidelijke kolommen:
 * Datum, Tijd, Stemming, de vier vragen en fotoverwijzing.
 */
export function exportEntriesToExcel(entries: DiaryEntry[], filename?: string): void {
  if (!entries || entries.length === 0) {
    throw new Error('Er zijn geen dagboeknotities om te exporteren.');
  }

  // Format data into rows
  const rows = entries.map((entry) => {
    // Haal tijd op uit createdAt
    let timeFormatted = 'Onbekend';
    if (entry.createdAt) {
      try {
        const dateObj = new Date(entry.createdAt);
        if (!isNaN(dateObj.getTime())) {
          timeFormatted = dateObj.toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        }
      } catch {
        timeFormatted = 'Onbekend';
      }
    }

    return {
      'Datum': entry.date || '',
      'Tijd': timeFormatted,
      'Stemming': entry.mood || '',
      'Wat heb je vandaag gedaan of geleerd?':
        entry.q1ActivitiesOrLearned || entry.q1Activities || '',
      'Wat ging er vandaag goed?':
        entry.q2WentWell || entry.q3WentWell || '',
      'Wat ging er vandaag minder goed?':
        entry.q3WentLessWell || '',
      'Wat wil je onthouden van vandaag?':
        entry.q4Remember || '',
      'Fotoverwijzing': entry.photoUrl || 'Geen foto',
      'Favoriet': entry.isFavorite ? 'Ja' : 'Nee',
    };
  });

  // Maak een werkblad van de JSON rijen
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Stel ruime kolombreedtes in voor een overzichtelijke weergave in Excel
  worksheet['!cols'] = [
    { wch: 14 }, // Datum
    { wch: 12 }, // Tijd
    { wch: 14 }, // Stemming
    { wch: 45 }, // Vraag 1: Wat gedaan of geleerd?
    { wch: 45 }, // Vraag 2: Wat ging goed?
    { wch: 45 }, // Vraag 3: Wat ging minder goed?
    { wch: 45 }, // Vraag 4: Wat onthouden?
    { wch: 28 }, // Fotoverwijzing
    { wch: 12 }, // Favoriet
  ];

  // Maak een werkmap en voeg het werkblad toe
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dagboeknotities');

  // Genereer bestandsnaam met datum
  const today = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `dagboek-notities-${today}.xlsx`;

  // Start download in de browser
  XLSX.writeFile(workbook, finalFilename, { bookType: 'xlsx', type: 'binary' });
}
