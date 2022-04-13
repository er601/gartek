import React, {useEffect, useMemo, useState} from 'react';
// import OrgProfile from "./views/profile/OrgProfile";
import Licenses from "./views/Licenses";
import SprMain from "./views/admin/spr";
import {autorun} from 'mobx'
import appStore from './store/AppStore'
import License from './views/License'
import Profile from "./views/profile/Profile";
import AdminLicenses from "./views/admin/AdminLicenses";
import Home from "./views/Home";
import {EsiLoginCb} from "./components/AuthWrapper";
import Infograph from "./views/Infograph";
import Feedback from "./views/Feedback";
import OrganizationsList from "./views/Organizations";
import Messages from "./views/Messages/Messages";
import AdminFeedback from "./views/admin/AdminFeedback";
import AdminMessages from "./views/admin/AdminMessage/AdminMessage";
import Info from "./views/Messages/News/Info";
import CreatePage from "./views/admin/AdminMessage/Instructions/CreatePage";
import EditPage from "./views/admin/AdminMessage/Instructions/EditPage";
import InfoPage from "./views/Messages/Instructions/InfoPage";
import AdminOrganization from "./views/admin/AdminOrganization";

const commonRoutes = [
  // esi_login [h] [c]
  {
    title: 'esi_login',
    path: '/esi_login',
    component: EsiLoginCb,
    exact: true,
    hidden: true,
  },
  // license/:id [h] [c]
  {
    title: 'Лицензия',
    path: '/license/:id?',
    exact: true,
    component: License,
    hidden: true,
  },
  {
    title: 'Новость',
    path: '/message/:id',
    component: Info,
    hidden: true
  },
  {
    title: 'Просмотр инструкции',
    path: '/instruction/:id',
    component: InfoPage,
    hidden: true
  },
  /*{
    title: 'Инструкции',
    path: '/instruction',
    exact:true,
    component:Instruction,
  },*/
];

const commonUserRoutes = [
  // profile [h]
  {
    title: 'Профиль',
    exact: true,
    path: '/profile',
    component: Profile,
    hidden: true,
  },
  // reports
  {
    title: 'Отчёты',
    path: '/reports',
  },
  // home
  {
    path: '/home',
    component: Home,
    hidden: true,
  },

  /*{
    title: 'Профиль организации',
    exact: true,
    path: '/org_profile',
    component: OrgProfile
  },*/
]

const publicRoutes = [
  // home
  {
    title: 'Реестры',
    path: '/home',
    component: Home,
    exact: true,
  },
  // infograph
  {
    title: 'Инфографика',
    path: '/infograph',
    component: Infograph,
    exact: true,
  },
  // feedback
  {
    title: 'Обратная связь',
    path: '/feedback',
    exact: true,
    component: Feedback,
  },
  // messages
  {
    title: 'Сообщения',
    path: '/messages',
    exact: true,
    component: Messages
  },
  //all Organizations
  {
    // title: 'Все организации',
    path: '/organizations',
    component: OrganizationsList
  },
  ///
  ...commonRoutes,
];

const userRoutes = [
  // licenses
  {
    title: 'Мои лицензии',
    path: '/licenses',
    component: Licenses
  },
  // feedback
  {
    title: 'Обратная связь',
    path: '/feedback',
    exact: true,
    component: Feedback,
  },
  // messages
  {
    title: 'Сообщения',
    path: '/messages',
    component: Messages
  },
  // license/new/:tin [h]
  {
    title: 'Создание лицензии',
    path: '/license/new/:tin',
    exact: true,
    component: License,
    hidden: true,
  },
  ///
  ...commonRoutes,
  ...commonUserRoutes,
]

const adminRoutes = [
  // admin/licenses
  {
    title: 'Все лицензии',
    path: '/admin/licenses',
    component: AdminLicenses,
  },
  {
    title: 'Об организации',
    path: '/admin/organization',
    component: AdminOrganization,
  },
  // admin/feedback
  {
    title: 'Обратная связь',
    path: '/admin/feedback',
    exact: true,
    component: AdminFeedback,
  },
  // admin/messages
  {
    title: 'Сообщения',
    path: '/admin/messages',
    component: AdminMessages,
  },
  {
    title: 'Добавление инструкции',
    path: '/admin/create/instruction',
    component: CreatePage,
    hidden: true
  },
  {
    title: 'Редактирования инструкции',
    path: '/admin/edit/instruction/:id',
    component: EditPage,
    hidden: true
  },
  {
    title: 'Создание лицензии',
    path: '/license/new/:tin',
    exact: true,
    component: License,
    hidden: true,
  },
  ///
  ...commonRoutes,
  ...commonUserRoutes,
]

const mainAdminRoutes = [
  ...adminRoutes.slice(0, 3),
  // spr [madm]
  {
    title: 'Справочники',
    path: '/spr',
    component: SprMain
  },
  ///
  ...adminRoutes.slice(3)
]

export function getRoutes(role) {
  switch (role) {
    case 'ROLE_USER':
      return userRoutes;
    case 'ROLE_ADMIN':
      return adminRoutes
    case 'ROLE_MAIN_ADMIN':
      return mainAdminRoutes
    default:
      return publicRoutes
  }
}

export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => autorun(() => {
    // reacts to appStore changes, disposes on unmount
    setUser(appStore.user);
  }), []);

  return user;
}

export function useRoutes() {
  const user = useUser();

  return useMemo(() => getRoutes(user?.role), [user?.role])
}


export {adminRoutes, userRoutes};
