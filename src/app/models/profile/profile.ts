export class Profile {
  Profile: _Profile;
}

export class _Profile {
  User: User;
  Person: Person;
}

export class User {
  Id: number;
  UserName: string;
  Name: string;
  Surname: string;
  EmailAddress: string;
  Image: string;
  Token: string;
  RefreshToken: string;
  WelcomeMessage: string;
  MenuTemplate: Object;
  RoleDescription: string;
  RoleShortName: string;
  RoleParent: string;

  EnableShoppingCart: boolean;

  CanDoInventory: boolean;
  ShowCost: boolean;
  ShowPrice: boolean;

  //Crud
  CanCreate: boolean;
  CanEdit: boolean;
  CanDelete: boolean;

  //Enterprise
  CanCreateEnterprise: boolean;
  CanEditEnterprise: boolean;
  CanDeleteEnterprise: boolean;

  IsVisitorUser: boolean;
}

export class Person {
  FirstName: string;
  SecondName: string;
  Surname: string;
  secondSurname: string;
  BirthDate: string;
  FullName: string;
  Gender: string;
  Locators: Locators[];
}

export class Locators {
  Id: number;
  Description: string;
  IsMain: boolean;
  Type: string;
}

export class Gender {
  Id: number;
  Description: string;
  ShortName: string;
}

export class LocatorsTypes {
  Id: number;
  Code: string;
  Description: string;
}

export class InfoCurrentUser {
  UserName: string;
  Password: string;
  Name: string;
  SurName: string;
  EmailAddress: string;
  PhoneNumber: string;
  Image: string;
}

export class InfoCurrentPerson {
  FirstName: string;
  SecondName: string;
  SurName: string;
  SecondSurname: string;
  BirthDate: string;
  FullName: string;
  GenderId: number;
  DocumentTypeId: number;
  DocumentNumber: string;
  DocumentDescription: string;

}

export class InfoCurrentLocators {
  Id: number;
  LocatorTypeId: number;
  LocatorTypeDescription: string;
  Description: string;
  IsMain: boolean;
}
