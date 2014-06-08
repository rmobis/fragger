/* Parses a frag message from Tibia.com and transforms it into a easily redable
 * object.
 */
function Frag(fragMessage) {
	var fragData;

	fragData = fragMessage.match(/^(.+?)\sKilled\s(.+)\sat\sLevel\s(\d+)\s(.+)$/);

	this.date   = new Date(this.convertDateToISO(fragData[1]));
	this.victim = fragData[2];
	this.level  = parseInt(fragData[3], 10);
	this.type   = fragData[4];
}

/* Month indexes based on their abbreviations. */
Frag.prototype.monthAbbr = {
	Jan: '01', Feb: '02', Mar: '03',
	Apr: '04', May: '05', Jun: '06',
	Jul: '07', Aug: '08', Sep: '09',
	Oct: '10', Nov: '11', Dec: '12',
};

/* Offsets for CET and CEST timezones */
Frag.prototype.timezoneOffset = {
	CET  : '+0100',
	CEST : '+0200',
};

/* Converts a date string from the format 'mmm DD YYYY, hh:mm:ss TTTT' to the
 * format specified by ISO 8601, where 'mmm' represents the first three letters
 * of the month's name, 'TTTT' represents the timezone (either 'CET' or 'CEST')
 * and all other symbols represent what was specified by ISO 8601.
 */
Frag.prototype.convertDateToISO = function(date) {
	var dateRegExp, dateData;

	// Splits the date in the following chunks:
	// {'...', 'mmm', 'DD', 'YYYY', 'hh:mm:ss', 'TTTT'}
	dateRegExp = /^([A-z]{3}) (\d{2}) (\d{4}), (\d{2}:\d{2}:\d{2}) (CES?T)$/;
	dateData = date.match(dateRegExp);

	dateString  = dateData[3];
	dateString += '-' + this.monthAbbr[dateData[1]];
	dateString += '-' + dateData[2];
	dateString += 'T' + dateData[4];
	dateString += this.timezoneOffset[dateData[5]];

	return dateString;
}