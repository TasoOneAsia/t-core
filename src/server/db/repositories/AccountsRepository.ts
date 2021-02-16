import { EntityRepository, Repository, Connection } from 'typeorm';
import AccountEntity from '../models/AccountEntity';

@EntityRepository(AccountEntity)
export class AccountsRepository extends Repository<AccountEntity> {
  async createNewAccount(
    identifier: string,
    characterId: number,
    type: string,
    bal: number
  ): Promise<AccountEntity> {
    const account = new AccountEntity();
    account.playerIdentifier = identifier;
    account.balance = bal;
    account.characterId = characterId;
    account.accountType = type;
    return await this.save(account);
  }

  async findAccountFromId(accountId: number): Promise<AccountEntity> {
    const account = await this.findOne({ where: { id: accountId } });
    if (account) return account;
    throw new Error(`Account not found for id: ${accountId}`);
  }

  async findAccountsforCharacter(characterId: number): Promise<AccountEntity[]> {
    const accounts = await this.find({ where: { characterId } });
    if (accounts) return accounts;
    throw new Error(`Accounts not found for characterId: ${characterId}`);
  }
}

export const getAccountRepo = (connection: Connection) =>
  connection.getCustomRepository(AccountsRepository);
