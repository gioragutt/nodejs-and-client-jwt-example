export interface Profile {
  username: string;
}

export interface AuthData {
  profile: Profile;
  token: string;
}
