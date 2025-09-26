import React, { useState, useEffect } from 'react'; // Importamos o useEffect
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  Keyboard,
} from 'react-native';
// 1. Importar o AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@OficinaApp:tasks'; // Chave para salvar os dados

export default function App() {
  const [inputText, setInputText] = useState('');
  // 2. Iniciar o estado de tarefas como um array vazio
  const [tasks, setTasks] = useState([]);

  // 3. Efeito para CARREGAR as tarefas do armazenamento quando o app inicia
  useEffect(() => {
    async function loadTasks() {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar as tarefas salvas.');
      }
    }
    loadTasks();
  }, []); // O array vazio [] faz com que este efeito rode apenas uma vez

  // 4. Efeito para SALVAR as tarefas sempre que a lista [tasks] for modificada
  useEffect(() => {
    async function saveTasks() {
      try {
        const jsonValue = JSON.stringify(tasks);
        await AsyncStorage.setItem(TASKS_STORAGE_KEY, jsonValue);
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível salvar as tarefas.');
      }
    }
    saveTasks();
  }, [tasks]); // Este efeito roda sempre que o estado 'tasks' mudar

  const handleAddTask = () => {
    if (inputText.trim() === '') {
      Alert.alert('Atenção', 'Por favor, digite uma tarefa.');
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      text: inputText,
    };
    // A lógica de salvar será disparada automaticamente pelo useEffect
    setTasks([...tasks, newTask]);
    setInputText('');
    Keyboard.dismiss();
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    // A lógica de salvar também será disparada aqui pelo useEffect
    setTasks(updatedTasks);
  };

  // O restante do código (a parte visual/JSX) permanece o mesmo
  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.text}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Minha Lista de Tarefas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma nova tarefa..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem item={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#333333',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#FF4136',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});