import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  Text,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';

const DATA = [
  {name: 'Marissa Castillo'},
  {name: 'Denzel Curry'},
  {name: 'Miles Ferguson'},
  {name: 'Kenny Moreno'},
  {name: 'Shelby Craig'},
  {name: 'Jordyn Brewer'},
  {name: 'Tanya Walker'},
  {name: 'Nolan Figueroa'},
  {name: 'Sophia Gibbs'},
  {name: 'Vincent Sandoval'},
];
const HEADER_HEIGHT = 240;
const TAB_BAR_HEIGHT = 50;

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const FirstRoute = ({position, handleScroll, firstRef}: any) => {
  return (
    <Animated.FlatList
      ref={firstRef}
      scrollEventThrottle={1}
      onScroll={Animated.event(
        [{nativeEvent: {contentOffset: {y: position}}}],
        {
          listener: (event: any) => {
            handleScroll('first', event.nativeEvent.contentOffset.y);
          },
          useNativeDriver: true,
        },
      )}
      data={DATA}
      keyExtractor={(item, i) => String(i)}
      renderItem={({item}) => (
        <View style={[styles.scene, {backgroundColor: '#ff4081'}]}>
          <Text>{item.name}</Text>
        </View>
      )}
      contentContainerStyle={{paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT}}
    />
  );
};

const SecondRoute = ({position, handleScroll, secondRef}: any) => (
  <Animated.FlatList
    ref={secondRef}
    scrollEventThrottle={1}
    onScroll={Animated.event([{nativeEvent: {contentOffset: {y: position}}}], {
      listener: (event: any) => {
        handleScroll('second', event.nativeEvent.contentOffset.y);
      },
      useNativeDriver: true,
    })}
    data={DATA}
    keyExtractor={(item, i) => String(i)}
    renderItem={({item}) => (
      <View style={[styles.scene, {backgroundColor: '#673ab7'}]}>
        <Text>{item.name}</Text>
      </View>
    )}
    contentContainerStyle={{paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT}}
  />
);

const App = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  const position: any = useRef(new Animated.Value(0)).current;
  const scrollTimer: any = useRef(0);

  const firstRef: any = useRef();
  const secondRef: any = useRef();

  function handleScroll(scene: any, y: any) {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      console.log(scene, 'sync');
      syncOffset(scene, y);
    }, 50);
  }

  const syncOffset = (scene: any, y: any) => {
    console.log(scene, y);
    if (scene === 'first') {
      secondRef?.current?.scrollToOffset({
        offset: y,
        animated: false,
      });
    }
    if (scene === 'second') {
      firstRef?.current?.scrollToOffset({
        offset: y,
        animated: false,
      });
    }
  };

  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'first':
        return (
          <FirstRoute
            position={position}
            handleScroll={handleScroll}
            firstRef={firstRef}
          />
        );
      case 'second':
        return (
          <SecondRoute
            position={position}
            handleScroll={handleScroll}
            secondRef={secondRef}
          />
        );
      default:
        return null;
    }
  };

  function renderTabBar(props: any) {
    const translateY = position.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        style={[
          {position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1},
          {transform: [{translateY}]},
        ]}>
        <View
          style={{
            height: HEADER_HEIGHT,
            backgroundColor: 'red',
          }}>
          <Text>Header</Text>
        </View>
        <TabBar {...props} style={{height: TAB_BAR_HEIGHT}} />
      </Animated.View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scene: {
    height: 150,
  },
});

export default App;
