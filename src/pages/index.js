import React, { useRef } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Link } from "gatsby";
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import './index.css'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      // backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  }),
);

// This query is executed at run time by Apollo.
const APOLLO_QUERY = gql`
query GetBookmarks {
  bookmarks {
    id
    url
    title
    desc
  }
}
`;

const AddBookMarkMutation = gql`
  mutation addBookmark($url: String!,$title: String! ,$desc: String!){
    addBookmark(url: $url,title: $title,desc: $desc){
     url 
    }
}
`

const IndexPage = () => {
  const classes = useStyles();

  const { loading, error, data} = useQuery(APOLLO_QUERY);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  const urlRef = useRef("");
  const titleRef = useRef("");
  const descRef = useRef("");

  const handleBookmark = async (e) => {
    e.preventDefault();
    console.log(urlRef.current.value);
    await addBookmark({
      variables: {
        url: urlRef.current.value,
        title: titleRef.current.value,
        desc: descRef.current.value
      },refetchQueries:[{query:APOLLO_QUERY}]
    });

    urlRef.current.value = '';
    titleRef.current.value = '';
    descRef.current.value = '';

  }

  console.log(data)
  return (
    <div>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography variant="h6">Gatsby Bookmark App</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="sm" width='100%'>
        <Box my={3}>
          <Box boxShadow={3} textAlign='center' my={3}>
           <div>
           <form >
              <input type='text'  name='url' placeholder='URL' ref={urlRef} /><br />
              <input type='text' name='title' placeholder='Title' ref={titleRef} /><br />
              <input type='text' name='Description' placeholder='Description' ref={descRef} /><br />
              <Button onClick={handleBookmark} variant="contained" color="primary">Add Bookmark</Button>
            </form>
           </div>
            
          </Box>

          <div>
            <List className={classes.root}>
              <Typography variant="h6">All Bookmarks from Apollo server</Typography>
              {loading && <p><CircularProgress /></p>}
              {error && <p>Error: ${error.message}</p>}
              {data && (
                <div>{data.bookmarks.map((book) =>
                  (
                    <ListItem alignItems="flex-start" key={book.id}>
                      <ListItemAvatar>
                        <Avatar alt={book.title} src="/static/images/avatar/1.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={book.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary"
                            >
                              <Link to={book.url}>{book.url}</Link><br />
                              {book.desc}
                            </Typography>

                          </React.Fragment>
                        }
                      />
                      {/* <div key={book.id}>{console.log(book)}
                <h3>{book.title}</h3>
                <p>{book.url}</p>
              </div> */}
                    </ListItem>
                  )

                )
                }</div>
              )}
            </List>
          </div>
        </Box>
      </Container>
    </div>
  )
}

export default IndexPage
