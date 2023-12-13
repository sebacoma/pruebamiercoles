import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const YourComponent = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await fetch('http://localhost:3000/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);

        const commentsResponse = await fetch('http://localhost:3000/');
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
      <View>
        {postComments.map(comment => (
          <Text key={comment.id}>{comment.body}</Text>
        ))}
      </View>
    );
  };

  const handleDelete = (postId) => {
    // Aquí puedes agregar la lógica para eliminar un post utilizando fetch
    // usando la ruta http://localhost:3000/posts/{postId} con el método DELETE
    // Recuerda actualizar el estado de posts después de eliminar
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
            {/* Agregar un botón para eliminar la publicación */}
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
