import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServerFacade from '../backend/ServerFacade';
import { userContext } from '../navigation/mainNavigator';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import ProfileImage from './ProfileImage';
import moment from 'moment';

export type Props = {
  snitch: SnitchEvent;
  user?: User;
};

const SnitchEventCard: React.FC<Props> = ({
  snitch, user
}) => {
  const [snitchOwner, setSnitchOwner] = useState<User|null>(null)
  const [error, setError] = useState<string>("")

  useEffect(()=>{
    if (user) setSnitchOwner(user);
    else loadSnitchOwner();
  }, [])

  async function loadSnitchOwner() {
    let user = ServerFacade.getUserById(snitch.userId)
    if (!user) {
      setError("Could not load Snitch")
    }
  }

  const {currentUser} = useContext(userContext);
  if (!currentUser) return <></>

  if (error) {
    return <Text>{error}</Text>
  }

  if (!snitchOwner) {
    return <Text>Loading...</Text>
  }

  const isUserOwner = snitch.userId === currentUser.userId;

  return (
    <View style={styles.container}>
      <ProfileImage user={snitchOwner} size={40}></ProfileImage>
      <View style={{marginLeft:10, width:'100%'}}>
        <Text style={{fontSize: 20}}>{snitchOwner.firstname} {snitchOwner.lastname}</Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailRowIcon}><Icon name="place" color="#888" size={20}></Icon></View>
            <Text>{snitch.restaurantData.name}</Text>
          </View>
          <View style={styles.detailRow}>
          <View style={styles.detailRowIcon}><Icon name="event" color="#888" size={18}></Icon></View>
            <Text>{getRelativeTime(snitch.created)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

function getRelativeTime(time:any) {
  if (moment().diff(time, 'd') >= 1) {
    return moment(time).format('MMM D, YYYY')
  }
  return moment(time).fromNow()
}


const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    width: '100%'
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10
  },
  detailRow : {
    flexGrow: 1,
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    fontSize: 15
  },
  detailRowIcon: {
    marginRight: 5
  }
});

export default SnitchEventCard;