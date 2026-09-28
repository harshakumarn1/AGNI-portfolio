import { personalInfo } from '../../data/content'
import SocialIcons from '../ui/SocialIcons'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-name">Harsha Kumar &copy; {new Date().getFullYear()}</p>
      <div className="footer-logo">
        <a href="#hero">
          <img src={personalInfo.logoImage} alt="AGNI" />
        </a>
      </div>
      <div className="footer-socials">
        <SocialIcons />
      </div>
    </footer>
  )
}
