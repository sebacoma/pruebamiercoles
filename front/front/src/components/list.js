import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Picker, Alert } from 'react-native';

const YourComponent = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await fetch('http://localhost:3000/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);

        const commentsResponse = await fetch('http://localhost:3000/comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderComments = (postId) => {
    const postComments = comments.filter(comment => comment.postId === postId);
    return (
      <View style={styles.commentsContainer}>
        {postComments.map(comment => (
          <View key={comment.id} style={styles.commentContainer}>
            <Text>{comment.body}</Text>
          </View>
        ))}
      </View>
    );
  };

  const handleDelete = async (postId) => {
    try {
      await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      });

      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);

      alert('Post Eliminado', 'El post ha sido eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredPosts = selectedAuthor ? posts.filter(post => post.author === selectedAuthor) : posts;

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAuthor}
          onValueChange={(itemValue) => setSelectedAuthor(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Filtrar por autor..." value="" />
          {Array.from(new Set(posts.map(post => post.author))).map(author => (
            <Picker.Item key={author} label={author} value={author} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.imageContainer}>
              <ImageBackground source={{ uri: item.image }} style={styles.backgroundImage}>
                <Text style={styles.title}>{item.title}</Text>
                {renderComments(item.id)}
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: 'black', // Fondo negro
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentContainer: {
    backgroundColor: '#f0f0f0', // Color de fondo para los comentarios
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default YourComponent;
