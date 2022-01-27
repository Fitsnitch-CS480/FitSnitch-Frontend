import React, {useContext, useState} from 'react';
import {userContext} from '../navigation/mainNavigator';
import {Auth} from '@aws-amplify/auth';
import { Button, StyleSheet, Text, View } from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const SettingsView: React.FC<Props> = ({
  name,
  baseEnthusiasmLevel = 0
}) => {


  //Get user from Context from mainNavigator
  const {currentUser, setCurrentUser} = useContext(userContext);


  let logout = async () => {
    await Auth.signOut()
    .then(async => {
      setCurrentUser(null);
    })
    .catch((err) => {
      console.log(':',err);
      if (!err.message) {
        console.log('1 Error when signing out: ', err);
      }
    });
  }


  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Settings
      </Text>
      <Button
        title="Logout"
        accessibilityLabel="logout"
        onPress={logout} 
        color="black"
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16
  }
});

export default SettingsView;