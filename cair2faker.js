const faker = require('faker');
const prompt = require('prompt');
const fs = require('fs');
const cliProgress = require('cli-progress');
require('dotenv').config()

const sexes = ['M', 'F', 'U'];
const suffixes = ['JR', 'SR', '', '', '', '', '', '', '', '', ''];
const cvxCodes = [
  {
    code: '08',
    description: 'HEPB-PEDIATRIC/ADOLESCENT',
  }, {
    code: '01',
    description: 'DTP',
  },
  {
    code: '02',
    description: 'OPV',
  },
  {
    code: '03',
    description: 'MMR',
  },
  {
    code: '04',
    description: 'MEASLES',
  },
  {
    code: '10',
    description: 'IPV',
  }
];
const amounts = ['0.25', '0.5', '1.0', '0.1', '2.0'];

const generate = (howMany) => {
  if (!howMany) return '';
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar1.start(howMany, 0);
  let data, cvx;
  for (let i=0; i<howMany; i++) {
    cvx = cvxCodes[Math.floor(Math.random() * cvxCodes.length)];
    data = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:urn="urn:cdc:iisb:2011">
     <soap:Header/>
     <soap:Body>
     <urn:submitSingleMessage>
     <urn:username>${process.env.CAIR2_USERNAME}</urn:username>
     <urn:password>${process.env.CAIR2_PASSWORD}</urn:password>
     <urn:facilityID>Portal Facility ID</urn:facilityID>
     <urn:hl7Message><![CDATA[MSH|^~\\&|MyEMR|DE-000001|
    |CAIRLO|${faker.date.recent().toISOString().substring(0,10).replace(/-/g,'')}||VXU^V04^VXU_V04|CA0001|P|2.5.1|||NE|AL||||||DE-000001
    PID|1||PA123456^^^^MR||${faker.name.lastName().toUpperCase()}^${faker.name.firstName().toUpperCase()}^${faker.name.firstName().toUpperCase().substring(0,1)}^${suffixes[Math.floor(Math.random() * suffixes.length)]}|${faker.name.lastName().toUpperCase()}^${faker.name.firstName().toUpperCase()}^G|${faker.date.past().toISOString().substring(0,10).replace(/-/g,'')}|${sexes[Math.floor(Math.random() * sexes.length)]}||2106-
    3^WHITE^HL70005|${faker.address.streetAddress().toUpperCase()}^^${faker.address.city().toUpperCase()}^${faker.address.stateAbbr().toUpperCase()}^${faker.address.zipCode()}^^H^^||^PRN^^^^555^5555555||ENG^English^HL70296|||||||2186-5^ not Hispanic or Latino
    ^HL70189||Y|2
    PD1|||||||||||02^REMINDER/RECALL – ANY METHOD^HL70215|N|20140730|||A|20140730|
    NK1|1|${faker.name.lastName().toUpperCase()}^${faker.name.firstName().toUpperCase()}|MTH^MOTHER^HL70063||||||||||||||
    ORC|RE||197023^CMC|||||||^Clark^Dave||^Smith^Janet^^^^^^^L^^^^^^^^^^^MD |||||
    RXA|0|1|${faker.date.recent().toISOString().substring(0,10).replace(/-/g,'')}||${cvx.code}^${cvx.description}^CVX|${amounts[Math.floor(Math.random() * amounts.length)]}|mL^mL^UCUM||00^NEW IMMUNIZATION
    RECORD^NIP001|1245319599^Smith^Janet^^^^^^CMS^^^^NPI^^^^^^^^MD |^^^DE000001||||0039F|20200531|MSD^MERCK^MVX|||CP|A
    RXR|IM^INTRAMUSCULAR^HL70162|LA^LEFT ARM^HL70163
    OBX|1|CE|64994-7^Vaccine funding program eligibility category^LN|1|V03^VFC eligibility –
    Uninsured^HL70064||||||F|||20110701140500]]>
    </urn:hl7Message>
     </urn:submitSingleMessage>
     </soap:Body>
    </soap:Envelope>`;
    fs.writeFileSync(`samples/sample${i+1}.xml`, data, (fsErr) => {
      if (fsErr) return console.log(`Error: ${fsErr}`);
    });
    bar1.increment();
  }
  bar1.stop();
};

prompt.start();

prompt.get(['messages'], (err, res) => {
  generate(res?.messages);
});