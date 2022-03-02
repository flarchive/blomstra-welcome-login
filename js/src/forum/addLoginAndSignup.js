import app from 'flarum/forum/app';
import { override } from 'flarum/common/extend';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import SignUpModal from 'flarum/forum/components/SignUpModal';

export default function addLoginAndSignup() {
  // Only allow logged in users to hide the WelcomeHero
  // Add signup and login buttons to the WelcomeHero
  override(WelcomeHero.prototype, 'view', function (original) {
    if (this.isHidden()) return null;

    const slideUp = () => {
      this.$().slideUp(this.hide.bind(this));
    };

    const loggedIn = !!app.session?.user;
    const extraDivClassName = !!app.forum.attribute('blomstra.welcome-login.only-mobile') ? 'extraSignin extraSigninMobile' : 'extraSignin';

    return (
      <header class="Hero WelcomeHero">
        <div class="container">
          {loggedIn ? (
            <Button
              icon="fas fa-times"
              onclick={slideUp}
              className="Hero-close Button Button--icon Button--link"
              aria-label={app.translator.trans('core.forum.welcome_hero.hide')}
            />
          ) : (
            ''
          )}

          <div class="containerNarrow">
            <h2 class="Hero-title">{app.forum.attribute('welcomeTitle')}</h2>
            <div class="Hero-subtitle">{m.trust(app.forum.attribute('welcomeMessage'))}</div>
          </div>

          {!loggedIn ? (
            <div class={extraDivClassName}>
              <br />
              {!!app.forum.attribute('allowSignUp') ? (
                <Button className="Button" onclick={() => app.modal.show(SignUpModal)}>
                  {app.translator.trans('core.forum.header.sign_up_link')}
                </Button>
              ) : (
                ''
              )}

              <Button className="Button Button--primary" onclick={() => app.modal.show(LogInModal)}>
                {app.translator.trans('core.forum.header.log_in_link')}
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      </header>
    );
  });

  // If there's no logged in user, always show the WelcomeHero
  override(WelcomeHero.prototype, 'isHidden', function (original) {
    if (!app.session?.user) return false;
    return original();
  });
}
