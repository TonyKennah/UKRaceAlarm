import { Link, LinkProps } from 'expo-router';
import { StyleSheet, TextProps } from 'react-native';

type StyledLinkProps = LinkProps & Omit<TextProps, 'style'> & { style?: TextProps['style'] };

export function StyledLink(props: StyledLinkProps) {
  return <Link {...props} style={[styles.link, props.style]} />;
}

const styles = StyleSheet.create({
  link: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});