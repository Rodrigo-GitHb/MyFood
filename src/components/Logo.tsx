import styled from 'styled-components'
import logoImg from '../assets/logo.png'

const LogoWrapper = styled.div`
  display: inline-block;
  img {
    height: 44px;
    width: auto;
    display: block;
  }
`

export const Logo = () => (
  <LogoWrapper>
    <img src={logoImg} alt="efood" />
  </LogoWrapper>
)
