const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_KEY);

export const table = base('coffee-stores');

const getAirtableRecord = (record) => {
  return {
    ...record.fields,
  };
};

export const getAirtableRecords = (records) => {
  if (!!records?.length) {
    return records.map((record) => getAirtableRecord(record));
  }
};
