import common from '../support/common';
const { React, expect, MockComponents } = common;
const { ScrollView } = MockComponents;

import { shallow, render } from 'enzyme';

import Artist from 'containers/artist';
import Header from 'components/artist/header';

describe('Artist container', function () {
  it('renders', function () {
    // expect(shallow(<Artist />).first().type().displayName).to.equal('ScrollView');
    // console.log(shallow(<Artist />).length);
    // expect(shallow(<Artist />).find('Header').text()).to.equal('Kevin Beasley');
  });
});
