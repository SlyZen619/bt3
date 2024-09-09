import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, StatusBar, Keyboard } from 'react-native';

const App = () => {
  const [isPortrait, setIsPortrait] = useState(true); // Trạng thái hướng màn hình
  const [inputText, setInputText] = useState('');      // Trạng thái nhập liệu
  const [keyboardVisible, setKeyboardVisible] = useState(false); // Trạng thái bàn phím

  // Lấy kích thước màn hình
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = StatusBar.currentHeight || 0; // Chiều cao của thanh trạng thái
  const imageWidth = screenWidth * 0.8; // Chiều rộng hình ảnh bằng 80% màn hình
  const imageHeight = isPortrait ? imageWidth * 0.6 : imageWidth * 0.3; // Giảm chiều cao hình ảnh khi ở chế độ ngang

  // Hàm kiểm tra và cập nhật hướng màn hình
  const checkOrientation = () => {
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    setIsPortrait(screenHeight > screenWidth); // Cập nhật trạng thái hướng
  };

  useEffect(() => {
    // Lắng nghe sự thay đổi kích thước màn hình
    const subscription = Dimensions.addEventListener('change', checkOrientation);

    // Lắng nghe trạng thái bàn phím
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Kiểm tra hướng ban đầu khi ứng dụng khởi chạy
    checkOrientation();

    // Hủy lắng nghe khi component bị unmount
    return () => {
      subscription?.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Màu nền và kiểu chữ của thanh trạng thái
  const statusBarStyle = Platform.select({
    ios: {
      backgroundColor: isPortrait ? 'lightgray' : 'darkgray',
      barStyle: isPortrait ? 'dark-content' : 'light-content',
    },
    android: {
      backgroundColor: isPortrait ? 'lightgray' : 'darkgray',
      barStyle: isPortrait ? 'dark-content' : 'light-content',
    },
  });

  // Chiều rộng và chiều cao của mỗi nút
  const buttonWidth = isPortrait ? screenWidth / 2 : screenWidth / 3; // Tăng kích thước nút bấm trong chế độ ngang
  const buttonHeight = isPortrait ? 50 : 60; // Tăng chiều cao nút bấm khi ở chế độ ngang

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Điều chỉnh độ đẩy khi bàn phím xuất hiện
    >
      <StatusBar
        backgroundColor={statusBarStyle.backgroundColor}
        barStyle={statusBarStyle.barStyle}
      />
      <View style={[styles.innerContainer, isPortrait ? styles.portrait : styles.landscape]}>
        <View style={[styles.imageWrapper, { paddingTop: statusBarHeight }]}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/6949272/pexels-photo-6949272.jpeg' }} // Đường dẫn đến hình ảnh đã cập nhật
            style={[styles.image, { width: imageWidth, height: imageHeight }]}
            resizeMode="contain"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nhập văn bản tại đây..."
          value={inputText}
          onChangeText={setInputText}
        />
        <View style={[styles.buttonGroup, isPortrait ? styles.portraitButtonGroup : styles.landscapeButtonGroup]}>
          <TouchableOpacity style={[styles.button, { width: buttonWidth, height: buttonHeight }]} onPress={() => {}}>
            <Text style={styles.buttonText}>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { width: buttonWidth, height: buttonHeight }]} onPress={() => {}}>
            <Text style={styles.buttonText}>Button 2</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Đặt nền trong suốt để không bị che khuất bởi thanh trạng thái
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 0, // Được điều chỉnh động theo chiều cao của thanh trạng thái
  },
  image: {
    marginBottom: 20, // Khoảng cách giữa hình ảnh và các nút
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20, // Khoảng cách giữa trường nhập liệu và các nút
  },
  buttonGroup: {
    justifyContent: 'center', // Căn giữa nhóm nút theo chiều ngang
    alignItems: 'center',     // Căn giữa nhóm nút theo chiều dọc
  },
  portraitButtonGroup: {
    flexDirection: 'column',  // Xếp nút chồng lên nhau theo chiều dọc khi ở chế độ dọc
  },
  landscapeButtonGroup: {
    flexDirection: 'row',     // Xếp nút cạnh nhau theo chiều ngang khi ở chế độ ngang
    justifyContent: 'center', // Căn giữa nhóm nút theo chiều ngang
    alignItems: 'center',     // Căn giữa nhóm nút theo chiều dọc
    marginTop: 20,            // Đẩy nút lên trên một chút để tránh bị chèn
  },
  button: {
    backgroundColor: '#2196F3', // Nền xanh dương cho nút
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,     // Khoảng cách giữa các nút
    marginVertical: 5,        // Khoảng cách dọc cho nút
    borderRadius: 5,          // Bo góc cho nút
  },
  buttonText: {
    color: 'white',           // Màu chữ trắng
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
