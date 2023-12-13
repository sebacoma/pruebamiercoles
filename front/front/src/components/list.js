import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const YourComponent = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await fetch('http://tu-servidor/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);

        const commentsResponse = await fetch('http://tu-servidor/comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderComments = (postId) => {
    const postComments = comments.filter(comment => comment.postId === postId);
    return (
      <View>
        {postComments.map(comment => (
          <Text key={comment.id}>{comment.body}</Text>
        ))}
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            {/* Renderizar comentarios para esta publicación */}
            {renderComments(item.id)}
            {/* Agregar un botón para eliminar la publicación si es necesario */}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text>Eliminar Publicación</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default YourComponent;
