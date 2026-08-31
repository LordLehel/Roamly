// frontend/app/app.config.ts
export default defineAppConfig({
  ui: {
    // Button
    button: {
      variants: {
        variant: {
          smallPrimaryActionButton:
            'rounded-full bg-brand-500 hover:bg-brand-600 text-surface-500 !px-6 !py-2 transition-colors shadow-sm font-bold tracking-wide cursor-pointer',
          smallAccentActionButton:
            'rounded-full bg-accent-500 hover:bg-accent-600 text-surface-500 !px-6 !py-2 transition-colors shadow-sm font-bold tracking-wide cursor-pointer',
          smallHollowActionButton:
            'rounded-full text-brand-500 ring-1 ring-brand-500/40 hover:bg-brand-500/20 !px-6 !py-2 transition-colors text-xs font-semibold cursor-pointer',
          actionHeroButton:
            'rounded-full inline-flex items-center justify-center !px-12 h-14 bg-brand-500 hover:bg-brand-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-bold tracking-wide transition-all hover:-translate-y-1 !text-xl cursor-pointer',
          actionAccentHeroButton:
            'rounded-full inline-flex items-center justify-center px-10 !h-12 bg-accent-500 hover:bg-accent-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-semibold tracking-wide transition-all hover:-translate-y-1 !text-md cursor-pointer',
          actionOkButton:
            'rounded-full !px-10 justify-center bg-brand-500 hover:bg-brand-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] h-12 font-bold tracking-wide transition-all text-lg cursor-pointer',
          actionCancelButton:
            'rounded-full !px-10 justify-center bg-transparent ring-1 ring-accent-500 text-accent-500 hover:bg-accent-500 hover:text-surface-500 h-11 font-bold tracking-wide transition-colors cursor-pointer',
          glassButton:
            'h-10 px-8 rounded-full !min-w-18 flex items-center justify-center text-md bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-surface-500/90 transition-colors cursor-pointer',
          glassOutlineButton:
            'border border-brand-500/50 px-6 py-2.5 rounded-md bg-light-bg/70 hover:bg-light-bg text-dark-text transition-colors backdrop-blur-md cursor-pointer',
          glassIconButton:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-surface-500/90 transition-colors',
          glassIconButtonDanger:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-error-500 hover:text-white transition-colors',
          glassIconButtonBrand:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-500/70 backdrop-blur-xl text-brand-500 ring-1 ring-dark-text/10 hover:bg-brand-50 transition-colors',
          ghostDangerIconButton:
            'text-dark-text/70 hover:text-error-500 transition-colors p-0 cursor-pointer',
          ghostBrandIconButton:
            'text-surface-500 hover:text-brand-500 p-1 transition-colors cursor-pointer',
        },
      },
    },
    // Card
    card: {
      slots: { root: 'w-full', body: 'p-8' },
      variants: {
        variant: {
          glass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text max-w-md mx-auto w-full',
          },
          interactiveGlass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text transition-transform hover:-translate-y-1',
            body: 'flex flex-col items-center justify-center h-full text-center p-8',
          },
          outlineGlass: {
            root: 'bg-surface-600/10 backdrop-blur-xl rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-0 ring-2 ring-white/60 text-white transition-all duration-500 ease-in-out',
            body: 'p-8 h-full flex flex-col',
          },
          pointedGlass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text transition-transform hover:-translate-y-1 cursor-pointer',
            body: 'flex flex-col items-center justify-center h-full text-center p-8',
          },
          documentGlass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text overflow-hidden transition-transform hover:-translate-y-1',
            body: 'p-0 flex flex-col h-full',
          },
        },
      },
    },

    // Form input
    input: {
      slots: { root: 'w-full' },
      variants: {
        variant: {
          glass: {
            base: 'bg-input-bg text-dark-text rounded-xl ring-1 ring-input-border placeholder:text-text-muted focus:ring-2 focus:ring-brand-500 transition-colors h-11 !px-5 shadow-none',
          },
          glassError: {
            base: 'bg-error-50 text-error-900 rounded-xl ring-1 ring-error-500 placeholder:text-error-300 focus:ring-2 focus:ring-error-500 transition-colors h-11 !px-5 shadow-none',
          },
        },
      },
    },

    // Formfield
    formField: {
      slots: {
        label: 'text-sm font-medium text-dark-text mb-1.5 ml-1 block',
        error: 'text-error-400 text-sm text-left font-small',
      },
    },

    // Avatar
    avatar: {
      slots: {
        root: '!bg-brand-500 text-surface-500 flex items-center justify-center rounded-full shadow-sm ring-1 ring-brand-500/30 font-bold overflow-hidden hover:ring-2 hover:ring-brand-500 transition-all',
      },
      variants: {
        size: {
          header: { root: 'w-9 h-9 text-base' },
          profileLg: { root: 'w-24 h-24 text-4xl shadow-md mb-2' },
        },
      },
      defaultVariants: { size: 'header' },
    },

    // Select
    select: {
      slots: {
        base: 'rounded-full text-brand-500 ring-1 ring-brand-500 bg-surface-500/70 backdrop-blur-md !px-4 !py-2 transition-colors text-xs font-semibold shadow-sm cursor-pointer justify-between min-w-36 flex-row-reverse',
        trailingIcon: 'absolute right-25 transition-transform pointer-events-none text-brand-500',
        content:
          'z-[100] bg-text backdrop-blur-xl rounded-2xl ring-1 ring-brand-500/30 shadow-xl text-dark-text mt-2 min-w-40',
        viewport: 'p-1',
        item: 'flex items-center justify-center text-center py-2 px-4 hover:bg-brand-500/20 text-dark-text cursor-pointer data-[highlighted]:bg-brand-500/20 data-[highlighted]:text-dark-text font-medium text-xs rounded-xl mx-1 my-0.5',
      },
    },

    // Modal
    modal: {
      slots: {
        overlay: 'fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm',
        content:
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] !w-[calc(60%-2rem)] !sm:max-w-md bg-white/90 backdrop-blur-2xl !rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/10 focus:outline-none overflow-hidden',
      },
    },
  },

  // Layout
  layout: {
    base: 'min-h-screen flex flex-col bg-light-bg text-dark-text font-sans bg-cover bg-center bg-no-repeat bg-fixed',
    mainDefault: 'flex-1 flex flex-col',
    mainAuth: 'flex-1 flex items-center justify-center p-6',
    pageWrapper: 'w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative',
    authWrapper: 'w-full max-w-md mx-auto flex flex-col gap-6',
    formWrapper: 'w-full flex flex-col gap-4',
    formActions: 'flex items-center justify-between pt-6',
    pageHeader: 'flex flex-col md:flex-row justify-between items-center w-full gap-6',
    actionGroup: 'flex items-center gap-4',
    cardGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full',
    documentGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4',
    singleButtonWrapper: 'pt-2 text-center w-full',
    sectionWrapper: 'mt-12 flex flex-col gap-6',
    profileCard:
      'w-full bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] ring-1 ring-surface-500/50 p-8 flex flex-col md:flex-row gap-10 relative',
    profilePictureWrapper: 'relative w-40 h-40 shrink-0 mx-auto md:mx-0 md:ml-12 mt-8 md:mt-0',
    profilePictureInner:
      'w-full h-full bg-brand-500 rounded-2xl overflow-hidden shadow-lg border border-surface-500/50 flex items-center justify-center relative',
    profileDetailsWrapper: 'flex-1 flex flex-col justify-center gap-3 text-dark-text pt-2',
    profileDetailRow: 'flex items-center gap-4',
    cardContent: 'flex flex-col gap-6 w-full pt-2',
    cardFooter:
      'flex items-end justify-between w-full pt-4 border-t border-dark-text/10 text-xs text-dark-text/70',
    documentCardHeader:
      'absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-linear-to-b from-black/50 to-transparent text-white',
    documentCardImage:
      'w-full h-40 bg-surface-600/30 flex flex-col items-center justify-center relative',
    documentCardMeta: 'p-4 flex flex-col gap-1.5 text-xs text-dark-text/80',
    divider: 'my-1 border-t border-dark-text/10 w-full',
    flexBetween: 'flex justify-between w-full',
    memberCardInner: 'flex items-start gap-4 w-full h-full',
    memberCardContent: 'flex-1 flex flex-col justify-between h-full min-h-16',

    // Home layout
    homeWrapper: 'flex-1 flex flex-col items-center px-6 py-12 gap-24 relative z-10 w-full',
    homeHeroSection: 'flex flex-col items-center text-center mt-10 max-w-3xl scroll-mt-24',
    homeCardsSection: 'flex flex-col md:flex-row flex-wrap gap-8 w-full max-w-6xl mt-12',
    homeContentSection:
      'flex flex-col items-center text-center max-w-3xl pt-12 border-t border-dark-text/10 scroll-mt-24',

    // Header layout
    headerBase:
      'flex items-center justify-between px-6 py-4 bg-surface-500/70 backdrop-blur-md shadow-sm z-50 border-b border-dark-text/10',
    headerSticky: 'sticky top-0',
    headerRelative: 'relative',
    logoWrapper: 'flex items-center gap-2 text-dark-text hover:opacity-80 transition-opacity w-max',
    navWrapper: 'hidden md:flex gap-8 font-bold tracking-wide',
    headerRight: 'flex-1 flex justify-end items-center gap-4',

    // Modal layout
    modalForm: 'flex flex-col gap-4 py-2',
    modalActions: 'flex items-center justify-between w-full',
    fileInput:
      'w-full text-sm text-dark-text/70 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-transparent file:text-brand-500 file:ring-1 file:ring-brand-500/40 hover:file:bg-brand-500/20 file:transition-colors file:cursor-pointer cursor-pointer',
  },

  // Tipography
  typography: {
    pageTitle: 'text-3xl font-bold text-surface-500 tracking-wide text-center',
    pageSubtitle: 'text-sm opacity-80 capitalize text-surface-500 font-semibold mt-1',
    cardTitle: 'text-xl font-bold tracking-wide text-dark-text truncate pr-2',
    cardTitleCenter: 'text-xl font-bold text-center tracking-wide text-dark-text truncate pr-2',
    authTitle: 'text-2xl font-medium tracking-wide text-brand-950',
    authTitleWrapper: 'text-center mb-8',
    sectionTitleTransparent: 'text-2xl font-bold text-surface-500 tracking-wide text-center flex-1',
    statusLoading: 'text-center py-10 text-dark-text/70',
    statusError: 'text-center py-10 text-error-500',
    formStatusError: 'text-error-400 text-sm text-center font-medium',
    formStatusSuccess: 'text-success-400 text-sm text-center font-medium',
    profileLabel: 'w-28 font-medium opacity-80 shrink-0',
    profileValue: 'font-bold text-lg',
    profileValueLg: 'font-bold text-xl leading-none',

    // Home
    homeHeroText: 'mt-10 text-lg text-brand-50 font-medium opacity-90 leading-relaxed',
    homeSectionTitle: 'text-3xl font-bold text-surface-500 tracking-wide',
    homeSectionText: 'mt-8 text-lg text-surface-500 font-medium opacity-90 leading-relaxed',

    // Header
    logoText: 'text-xl font-semibold tracking-wider',
    navLink: 'hover:text-brand-500 hover:underline underline-offset-4 transition-colors',

    // Modal
    modalText: 'text-sm text-dark-text/80 py-2',
    modalHighlight: 'block font-semibold mt-1 text-brand-500',
    modalErrorBox:
      'text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20',
    modalSuccessBox:
      'text-xs font-semibold text-brand-500 mt-2 bg-brand-500/10 p-2 rounded border border-brand-500/20',
    inputLabel: 'block text-sm font-medium text-dark-text mb-1',
    inputError: 'text-xs text-error-500 mt-1',
  },

  // Footer
  footer: {
    base: 'py-5 px-6 flex items-center justify-between text-xs text-dark-text bg-light-bg/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10',
    text: 'font-medium opacity-80',
  },
});
