import { Header } from './shared/header'

export const pkg = props => (
  <Container className="grid" margin={40} breakpoints={['xs', 'sm']}>
    <Header
      $ref="#/components/Headline"
      className="header"
      visible
      inline={false}>
      {props.name}
    </Header>
    <Body style={{ width: '100%' }} content={{ type: 'wsj_body' }}>
      {props.body}
    </Body>
    <Footer className="footer" navType="WSJ" />
  </Container>
)
