export interface UserCharacter {
  name: string;
  DOB: string;
  gender: 'male' | 'female';
  characterID: number;
  playerIdentifier: string;
  location: string;
  createdOn: Date;
  updatedOn: Date;
  isDeleted: boolean;
}

export interface ICreateCharacter {
  playerIdent: string;
  name: string;
  DOB: string;
  gender: 'male' | 'female';
}
