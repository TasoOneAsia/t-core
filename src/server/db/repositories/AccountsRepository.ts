import { EntityRepository, Repository, Connection } from 'typeorm';
import Account from '../models/Account';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async createNewAccount(
    identifier: string,
    characterId: number,
    type: string,
    bal: number
  ): Promise<Account> {
    const account = new Account();
    account.playerIdentifier = identifier;
    account.balance = bal;
    account.characterId = characterId;
    account.accountType = type;
    return await this.save(account);
  }

  async findAccountFromId(accountId: number): Promise<Account> {
    const account = await this.findOne({ where: { id: accountId } });
    if (account) return account;
    throw new Error(`Account not found for id: ${accountId}`);
  }

  async findAccountsforCharacter(characterId: number): Promise<Account[]> {
    const accounts = await this.find({ where: { characterId } });
    if (accounts) return accounts;
    throw new Error(`Accounts not found for characterId: ${characterId}`);
  }
}

export const getAccountRepo = (connection: Connection) =>
  connection.getCustomRepository(AccountsRepository);
