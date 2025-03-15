import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  ScheduledDay: { starton: string; finishedon: string };
};

export type NavigationProps = StackNavigationProp<RootStackParamList, "Home">;
