import styled from 'styled-components'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Logo } from '../Logo'

const FooterWrapper = styled.footer`
  background-color: var(--light);
  margin-top: 80px;
  padding: 40px 0;
  text-align: center;

  .social {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 32px 0 80px;
  }

  p {
    font-size: 10px;
    line-height: 12px;
    margin: 0 auto;
    max-width: 480px;
  }
`

export const Footer = () => (
  <FooterWrapper>
    <div className="container">
      <Logo />
      <div className="social" aria-label="Redes sociais">
        <Instagram size={24} />
        <Facebook size={24} />
        <Twitter size={24} />
      </div>
      <p>
        A efood é uma plataforma para divulgação de estabelecimentos. A responsabilidade pela
        entrega, qualidade dos produtos é toda do estabelecimento contratado.
      </p>
    </div>
  </FooterWrapper>
)
