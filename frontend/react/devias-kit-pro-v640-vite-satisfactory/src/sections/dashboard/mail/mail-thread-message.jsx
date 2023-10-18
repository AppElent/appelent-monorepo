import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';

const MarkdownWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: theme.typography.body1.fontFamily,
  '& > p': {
    fontSize: theme.typography.body1.fontSize,
    lineHeight: theme.typography.body1.lineHeight,
    marginBottom: theme.spacing(2),
  },
}));

export const MailThreadMessage = (props) => {
  const { message = '' } = props;

  return (
    <MarkdownWrapper>
      <Markdown>{message}</Markdown>
    </MarkdownWrapper>
  );
};

MailThreadMessage.propTypes = {
  message: PropTypes.string,
};
