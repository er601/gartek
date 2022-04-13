import React, {useEffect} from 'react';
import {AuthProvider, useAuth, UserManager} from 'oidc-react';
import appStore from '../store/AppStore'
import {useHistory, useLocation} from 'react-router-dom'
import {BASE_URL} from '../common/requester'
import {isDevMode} from "../common/utils";

// http://wiki.tunduk.kg/doku.php?id=esia-specification
// https://wiki.tunduk.kg/doku.php?id=iis-info
// https://github.com/bjerkio/oidc-react/blob/master/docs/interfaces/authcontextinterface.authproviderprops.md
// https://github.com/IdentityModel/oidc-client-js/wiki

let {metadata, ...oidcConfig} = CONFIG.oidcConfig
oidcConfig = {
  ...oidcConfig,
  scope: 'openid profile email phone',
  autoSignIn: false,
};

oidcConfig.userManager = new UserManager({
  authority: oidcConfig.authority,
  client_id: oidcConfig.clientId,
  client_secret: oidcConfig.clientSecret,
  redirect_uri: oidcConfig.redirectUri,
  scope: oidcConfig.scope,
  response_type: "code",
  loadUserInfo: true,

  metadata,
});

const AuthWrapper = (props) => {
  useEffect(() => {
    // debugger
    appStore.autoLogin();
  }, []);

  return (
    <AuthProvider {...oidcConfig}>
      {props.children}
    </AuthProvider>
  )
};

export default AuthWrapper;


export const EsiLoginCb = () => {
  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

  const signInCb = async () => {
    const data = location.search

    if (data) {
      const mgr = auth.userManager;
      history.replace('/esi_login')

      try {
        const user = await mgr.signinRedirectCallback(data);
        let token = user.profile?.token?.accessToken;
        appStore.setToken(token)
        await appStore.autoLogin();

      } catch (e) {
        console.warn(e)
        // e
        // debugger
      }
    }

    history.replace('/home')
  };

  useEffect(() => {
    signInCb();
  }, [])

  return null;
}
