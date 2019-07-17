import { Header } from './shared/header'

export const pkg = props => (
  //<div className="grid" margin={40} breakpoints={['xs', 'sm']}>
  <Header
    $ref="#/components/Headline"
    className="header"
    visible
    inline={false}>
    {props.name}
  </Header>
  //<div style={{ width: '100%' }} content={{ type: 'wsj_body' }}>
  //  {props.body}
  //</div>
  //<div className="footer" navType="WSJ" />
  //</div>
)
