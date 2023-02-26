const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_KEY);

export const table = base('coffee-stores');

const getAirtableRecord = (record) => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

export const getAirtableRecords = (records) => {
  if (!!records?.length) {
    return records.map((record) => getAirtableRecord(record));
  }
};

export const findCoffeeStoreRecordByFormula = async (id) => {
  const findCoffeeStoresRecordById = await table
    .select({
      // This function will be returned in Array form
      filterByFormula: `id="${id}"`,
    })
    .firstPage(); // Since we only have 1 page, use firstPage

  return getAirtableRecords(findCoffeeStoresRecordById);
};
