import { TableConfig, getCellByName, getCellByType } from './table';

const donationTable: TableConfig = {
  guid: 'W3gxW6cwkYTDY6DD',
  indexKey: 'donation',
  sheets: [ '捐款表' ],
  skipRows: 4,
  skipColumns: 1,
  nameRow: 2,
  typeRow: 3,
  defaultValueRow: 4,
  maxColumn: 'O',
  getFilePath: () => 'donation/data.json',
  feParser: async (data: any[]) => {
    return data.map((row, id) => {
      const accountNames = getCellByName(row, '账户名').value;
      const bankNames = getCellByName(row, '开户行').value;
      const accounts = getCellByName(row, '账号').value;
      const bankAccounts: any[] = [];
      if (accountNames !== '') {
        const accountNamesArray = accountNames.split('|');
        const bankNamesArray = bankNames.split('|');
        const accountsArray = accounts.toString().split('|');
        accountNamesArray.forEach((accountName, index) => {
          bankAccounts.push({
            name: accountName,
            bank: bankNamesArray[index],
            number: accountsArray[index],
          });
        });
      }
      return {
        id,
        name: getCellByName(row, '受赠组织').value,
        contacts: getCellByType(row, 'contact').value,
        address: getCellByType(row, 'address').value,
        email: getCellByName(row, '邮箱').value,
        wechat: getCellByName(row, '微信公众号').value,
        bankAccounts,
        rfb: getCellByName(row, '汇款附言').value,
        remark: getCellByName(row, '备注').value,
        date: getCellByType(row, 'date').value,
        url: getCellByType(row, 'url').value,
        status: getCellByName(row, '当前状态').value,
      };
    });
  },
};

export default donationTable;
