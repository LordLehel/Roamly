// frontend/app/utils/constants.ts
// Global
export const CONST_BRAND_NAME = 'ROAMLY';
export const CONST_HOME_TITLE = 'Home';
export const CONST_ABOUT_TITLE = 'About';
export const CONST_SUPPORT_TITLE = 'Support';
export const CONST_LOGIN_TITLE = 'Log in';
export const CONST_LOGOUT_TITLE = 'Log out';
export const CONST_REGISTER_TITLE = 'Register';
export const CONST_REGISTER_PROMPT_BTN = "You don't have an account? Register one here.";
export const CONST_GO_BACK_TITLE = 'Go Back';
export const CONST_COPYRIGHT_LABEL = '© Copyright - Roamly Co. 2026 | All rights reserved.';

// Backgrounds
export const CONST_BG_AUTH = "bg-[url('/register/register-background.jpg')]";
export const CONST_BG_HOME = "bg-[url('/home/home-background.jpg')]";
export const CONST_BG_GROUPS = "bg-[url('/groups/groups-background.jpg')]";
export const CONST_BG_PROFILE = "bg-[url('/profile/profile-background.jpg')]";

// Form
export const CONST_LOGIN_HEADING = 'Log into your account';
export const CONST_REGISTER_HEADING = 'Register account';
export const CONST_EMAIL_LABEL = 'Email';
export const CONST_USERNAME_LABEL = 'Username';
export const CONST_PHONE_LABEL = 'Phone number';
export const CONST_PASSWORD_LABEL = 'Password';
export const CONST_REPEAT_PASSWORD_LABEL = 'Repeat password';
export const CONST_CANCEL_BTN = 'Cancel';
export const CONST_LOGIN_SUCCESS = 'Login successful! Redirecting...';
export const CONST_REGISTER_SUCCESS = 'Registration successful! Redirecting to login page...';

// Home
export const CONST_LEARN_MORE = 'Learn more';
export const CONST_SHOW_LESS = 'Show less';
export const CONST_GET_STARTED = 'Get Started';
export const CONST_DOCUMENT_MANAGEMENT = 'Document Management';
export const CONST_EVENT_CALENDAR = 'Event Calendar';
export const CONST_GROUP_GALLERY = 'Group Gallery';
export const CONST_HOME_DESCRIPTION =
  "Welcome to Roamly, your ultimate companion for seamless travel planning and unforgettable group adventures. Organize your documents, coordinate schedules, and share your journey's best moments all in one harmonious space.";
export const CONST_DOCUMENT_MANAGEMENT_DESCRIPTION =
  'Easily organize, store, and access all your travel documents and itineraries in one secure place.';
export const CONST_DOCUMENT_MANAGEMENT_EXTENDED =
  'There will be a document feature description here.';
export const CONST_EVENT_CALENDAR_DESCRIPTION =
  'Keep track of your upcoming trips, group meetups, and schedules without missing a single beat.';
export const CONST_EVENT_CALENDAR_EXTENDED = 'There will be a calendar feature description here.';
export const CONST_GROUP_GALLERY_DESCRIPTION =
  'Share memorable moments and browse through community photo collections from past adventures.';
export const CONST_GROUP_GALLERY_EXTENDED =
  'There will be a group gallery feature description here.';

// About
export const CONST_ABOUT_HERO = 'About Roamly';
export const CONST_ABOUT_DESCRIPTION =
  'Our team is dedicated to providing the best experience for travelers. We are passionate about helping groups plan their trips efficiently and enjoyably. Our goal is to make travel planning a breeze, so you can focus on creating unforgettable memories.';

// Support
export const CONST_SUPPORT_HERO = 'How can we help you?';
export const CONST_SUPPORT_DESCRIPTION =
  'Need assistance with your travel documents, calendar syncing, or account settings? Our support team is here to ensure your Roamly experience is smooth and effortless.';
export const CONST_SUPPORT_PICTURE_PATH = '/support/json-statham.jpg';

// Groups
export const CONST_NAV_VIEWS = [
  { label: 'Profile', value: '/users/profile' },
  { label: 'Groups', value: '/groups' },
  { label: 'Events', value: '/events' },
];
export const CONST_GROUPS_HEADING = 'Your groups';
export const CONST_FILTER_LABEL = 'Filter';
export const CONST_CREATED_AT_LABEL = 'Created at:';
export const CONST_ROLE_LABEL = 'Your role:';

// Delete Group Modal
export const CONST_DELETE_GROUP_TITLE = 'Delete group';
export const CONST_DELETE_GROUP_CONFIRM = 'Are you sure you want to delete this group?';
export const CONST_DELETE_BTN = 'Delete';
export const CONST_CANCEL_BTN_TEXT = 'Cancel';

// Create Group Modal
export const CONST_CREATE_GROUP_TITLE = 'Create new group';
export const CONST_GROUP_NAME_LABEL = 'Group name';
export const CONST_GROUP_NAME_PLACEHOLDER = 'e.g. Summer Vacation';
export const CONST_CREATE_BTN = 'Create';
export const CONST_NO_GROUPS_MSG = 'You are not a member of any group yet.';
export const CONST_LOADING_TEXT = 'Loading...';
export const CONST_FETCH_ERROR_TEXT = 'An error occurred while loading data.';
export const CONST_INVALID_DATA_ERROR = 'Invalid data!';
export const CONST_CREATE_ERROR_GENERIC = 'An error occurred while creating the group!';

// Leave group Modal
export const CONST_LEAVE_GROUP_TITLE = 'Leave group';
export const CONST_LEAVE_GROUP_CONFIRM = 'Are you sure you want to leave this group?';
export const CONST_LEAVE_BTN = 'Leave';
export const CONST_LEAVE_GROUP_WARNING =
  "This group has only one member. Leaving it will result in it's deletion with all it's data.";

// Invites
export const CONST_INVITES_HEADING = 'Pending invitations';
export const CONST_JOIN_GROUP_TITLE = 'Join group';
export const CONST_JOIN_GROUP_CONFIRM = 'Are you sure you want to join this group?';
export const CONST_JOIN_BTN = 'Join';
export const CONST_DECLINE_INVITE_TITLE = 'Decline invitation';
export const CONST_DECLINE_INVITE_CONFIRM = 'Are you sure you want to decline this invitation?';
export const CONST_DECLINE_BTN = 'Decline';
export const CONST_NO_INVITES_MSG = 'You have no pending invitations.';
