// types.ts
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    CreateLobby: undefined;
    JoinLobby: { prefillCode?: string };
    HostLobby: undefined;
    QRScanner: undefined;
    JoinedLobby: undefined;
    PlayerLobby: undefined;

    FinalPodium: undefined;
    Round: undefined;
    RoundCompleted: undefined;

    PhotoChallengeScreen: undefined;
    PhotoChallengeCamera: undefined;
    PhotoChallengeVote: undefined;
    PhotoChallengeScore: undefined;

    TheChallengeScreen: undefined;
    TheChallengePunishment: undefined;
  };
  