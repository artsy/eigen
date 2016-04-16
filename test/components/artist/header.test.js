import common from '../../support/common';
const { React, expect, MockComponents } = common;
const { Text } = MockComponents;

import { shallow } from 'enzyme';

import Header from 'components/artist/header';

describe('Artist Header', function () {
    it('renders', function () {
      expect(shallow(<Header />)).to.contain(<Text>Kevin Beasley</Text>);
    });
});
