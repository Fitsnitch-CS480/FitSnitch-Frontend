import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TextInput, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authContext } from '../authWrapper';
import T from '../../assets/constants/text';
import Colors from '../../assets/constants/colors';
import AuthService from '../../services/AuthService';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

const LoginView : React.FC = () => {
	const navigation = useNavigation<any>();
	const [email, onChangeEmail] = useState('');
	const [password, onChangePassword] = useState('');
	const [error, setErrorMessage] = useState('');

	//Get user from Context from mainNavigator
	const { authUser, setAuthUser } = useContext(authContext);
	const [loading, setLoading] = useState<boolean>(false);

	const signInFunction = async () => {
		if (loading) return;
		setLoading(true);

		//If email and password are good, attempt login. Read errors and respond acordingly.
		if (email.length > 4 && password.length > 2) {
			try {
				let user = await AuthService.attemptLogin(email, password);
				// Setting the user will trigger a navigation to the rest of the app
				setLoading(false);
				setAuthUser(user);
			}
			catch (err:any) {
				console.log('Could not log in', err);
				setErrorMessage(err.message);
				setLoading(false)
				return;
			}
		}
		else {
			setErrorMessage(T.error.provideEmailPassword);
			setLoading(false)
		}
	};

	const signInWithGoogle = async () => {
		setLoading(true);
		try{
			const user:any = await AuthService.googleSignIn();
			console.log("google user: ", user)
			setLoading(false);
			setAuthUser(user);
		}catch(error:any){
			setLoading(false);
			setErrorMessage(error);
		}
	}

	return (
		<ScrollView style={styles.screen}>
			<View style={styles.container}>
				<Image
					source={require("../../assets/images/main_logo.png")}
					resizeMode="contain"
					style={styles.image}
				/>

				<View style={styles.materialUnderlineTextboxStack}>
					<TextInput placeholder={T.signUp.email} onChangeText={onChangeEmail} style={styles.textBox}></TextInput>
					<TextInput placeholder={T.signUp.password} secureTextEntry onChangeText={onChangePassword} style={styles.textBox}></TextInput>
				</View>

				<View>
				<Text style={styles.errorMessage}>{error}</Text>
				</View>

				<View style={styles.materialButtonPrimary}>
					{loading ?
						<ActivityIndicator color={Colors.red} size={30} />
						:
						<Button color={Colors.red} title={T.logIn.title} onPress={() => loading ? null : signInFunction()}></Button>
					}
				</View>

				<View style={styles.textContainer}>
					<Text style={styles.dontHaveAccount}>{T.logIn.dontHaveAccount}</Text>
					<Text style={styles.signUpText} onPress={() => navigation.navigate('signup')}>{T.signUp.title}</Text>
				</View>


				{/* <View style={styles.otherSignInButtons}> */}
				<View>
					<TouchableOpacity
						style={styles.buttonGPlusStyle}
						onPress={() => loading ? null : signInWithGoogle()}
						activeOpacity={0.5}>
						<Image
							source={{
							uri:
								'https://uploads-ssl.webflow.com/5fc772e04f6c876a6ec3bf00/60c750a809c0a67367e7ddc6_Blog_HowToInvestInAlphabet.png',
							}}
							style={styles.buttonImageIconStyle}
						/>
						<View style={styles.buttonIconSeparatorStyle} />
						<Text style={styles.buttonTextStyle}>
							Sign in with Google
						</Text>
					</TouchableOpacity>
					{/* <GoogleSigninButton
  style={{ width: 192, height: 48, }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Light}
//   onPress={this._signIn}
//   disabled={this.state.isSigninInProgress}
/> */}
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	screen: {
		backgroundColor: Colors.background
	},
	materialButtonPrimary: {
		height: 36,
		width: 289,
		marginVertical: 20,
	},
	otherSignInButtons: {
		height: 36,
		width: 250,
		marginVertical: 20,
	},
	buttonGPlusStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: Colors.red,
		borderWidth: 1,
		borderColor: '#fff',
		height: 40,
		borderRadius: 50,
		marginVertical: 20,
		width: 230,
		margin: 25,
	  },
	  buttonImageIconStyle: {
		padding: 5,
		margin: 15,
		height: 36,
		width: 25,
		// resizeMode: 'stretch',
	  },
	  buttonTextStyle: {
		color: Colors.white,
		fontWeight: "bold",
		marginBottom: 4,
		marginLeft: 15,
	  },
	  buttonIconSeparatorStyle: {
		backgroundColor: '#fff',
		width: 1,
		height: 40,
	  },
	textContainer: {
		flex: 2,
		flexDirection: 'row'
	},
	dontHaveAccount: {
		fontFamily: "roboto-regular",
		color: Colors.white,
		marginRight: 5,
		fontSize: 15,
	},
	signUpText: {
		fontFamily: "roboto-regular",
		fontSize: 15,
		fontWeight: 'bold',
		color: Colors.red,
	},
	materialUnderlineTextbox: {
		height: 43,
		width: 289,
		position: "absolute",
		left: 0,
		top: 0,
	},
	materialUnderlineTextboxStack: {
		width: 289,
		marginTop: 20
	},
	textBox: {
		backgroundColor: Colors.white,
		color: Colors.charcoal,
		borderRadius: 50,
		marginVertical: 5,
		paddingLeft: 20,
		height: 40
	},
	image: {
		height: 200,
		width: 200,
		marginTop: 50
	},
	materialUnderlineTextbox1: {
		height: 43,
		width: 289,
	},
	errorMessage: {
		color: Colors.red,
	}
});

export default LoginView;