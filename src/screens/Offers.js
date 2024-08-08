import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StatusBar,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";
export default function Home({ route, navigation }) {
  const username = route.params.username;
  const [i, setI] = useState("createNewPost");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalPost, setModalPost] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [postDesc, setPostDesc] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDuration, setOfferDuration] = useState("");
  const [Posts, setPosts] = useState([]);

  const getPosts = async () => {
    setRefreshing(true);
    setLoading(false);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    console.log(res.data);
    setPosts(res.data);
  };

  useEffect(() => {
    getPosts();
    setPosts([
      {
        id: "iuegfikdj",
        title: "enfoinlsk",
        description: "uewgirnfwiojcd",
        created_at: "2021-10-10T00:00:00Z",
      },
      {
        id: "iuegfikdj",
        title: "enfoinlsk",
        description: "uewgirnfwiojcd",
        created_at: "2021-10-10T00:00:00Z",
      },
    ]);
  }, []);
  const name = username;

  const openModal = (post) => {
    setModalPost(post);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const deletePost = (id) => {};

  const postOffer = () => {
    console.log(offerTitle);
    console.log(postDesc);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        openModal(item);
      }}
    >
      <>
        <View style={[styles.renderItem, styles.listShadow]}>
          <View style={{ padding: 10 }}>
            <Text>{item.title}</Text>
          </View>
          <View style={styles.dateTime}>
            <Text>{item.created_at.substring(0, 10)}</Text>
            <Text>{item.created_at.substring(11, 19)}</Text>
          </View>
        </View>
      </>
    </Pressable>
  );

  const displayItems = () => {
    if (!modalPost) {
      return <Text>No items found.</Text>;
    }
    return (
      <View
        style={{
          padding: 10,
          flexDirection: "column",
        }}
      >
        <Text style={{ width: "100%", textAlign: "center" }}>
          {modalPost.description}
        </Text>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor="#ad8840" />
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={styles.userName}>{name}</Text>
          <View
            style={{
              alignSelf: "flex-end",
              paddingRight: 10,
              paddingTop: 5,
              paddingBottom: 10,
            }}
          ></View>
        </View>
        <View style={{ justifyContent: "space-around", flexDirection: "row" }}>
          <Pressable
            onPress={() => {
              setI("createNewPost");
            }}
            style={[
              {
                borderBottomWidth: i == "createNewPost" ? 2 : 0,
              },
              styles.filterButton,
            ]}
          >
            <View>
              <Text>New Post</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              setI("myPosts");
            }}
            style={[
              {
                borderBottomWidth: i == "myPosts" ? 2 : 0,
              },
              styles.filterButton,
            ]}
          >
            <View>
              <Text>My Posts</Text>
            </View>
          </Pressable>
        </View>
        {i == "createNewPost" ? (
          <>
            <ScrollView>
              <Text style={{ textAlign: "center", fontSize: 20 }}>Title</Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#000000",
                  margin: 10,
                  borderRadius: 5,
                }}
              >
                <TextInput
                  editable
                  onChangeText={(text) => setOfferTitle(text)}
                  value={offerTitle}
                  style={{ padding: 10, fontSize: 20 }}
                />
              </View>

              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Description
              </Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#000000",
                  margin: 10,
                  borderRadius: 5,
                }}
              >
                <TextInput
                  editable
                  multiline
                  numberOfLines={10}
                  maxLength={400}
                  onChangeText={(text) => setPostDesc(text)}
                  value={postDesc}
                  style={{ padding: 10 }}
                />
              </View>

              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Duration (in mins)
              </Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#000000",
                  margin: 10,
                  borderRadius: 5,
                }}
              >
                <TextInput
                  editable
                  onChangeText={(text) => setOfferDuration(text)}
                  value={offerDuration}
                  style={{ padding: 10, fontSize: 20 }}
                />
              </View>
              <View
                style={[styles.buttonContainer, { marginHorizontal: "20%" }]}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    postOffer();
                  }}
                >
                  <Text style={styles.buttonText}>Post Offer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </>
        ) : (
          <>
            {!loading ? (
              <View style={styles.bottomView}>
                <FlatList
                  style={{ width: "100%", marginTop: 5 }}
                  data={Posts}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={getPosts}
                    />
                  }
                />
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.renderItem,
                    {
                      height: 85,
                      backgroundColor: "#333333",
                      opacity: 0.5,
                    },
                  ]}
                ></View>
                <View
                  style={[
                    styles.renderItem,
                    {
                      height: 85,
                      backgroundColor: "#333333",
                      opacity: 0.4,
                    },
                  ]}
                ></View>
                <View
                  style={[
                    styles.renderItem,
                    {
                      height: 85,
                      backgroundColor: "#333333",
                      opacity: 0.3,
                    },
                  ]}
                ></View>
                <View
                  style={[
                    styles.renderItem,
                    {
                      height: 85,
                      backgroundColor: "#333333",
                      opacity: 0.2,
                    },
                  ]}
                ></View>
                <View
                  style={[
                    styles.renderItem,
                    {
                      height: 85,
                      backgroundColor: "#333333",
                      opacity: 0.1,
                    },
                  ]}
                ></View>
              </>
            )}
          </>
        )}

        {modalVisible && (
          <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalBackground}>
                <BlurView intensity={50} style={styles.blurContainer}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <Text style={styles.heading1}>{modalPost.title}</Text>
                      <View style={styles.table}>
                        <View style={styles.header}></View>
                        {displayItems()}
                      </View>
                      <Text>{modalPost.created_at}</Text>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            deletePost(modalPost.id);
                            closeModal();
                          }}
                          style={{
                            margin: 10,
                            backgroundColor: "red",
                            padding: 10,
                            borderRadius: 5,
                          }}
                        >
                          <View>
                            <Text>Delete</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </BlurView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  table: {
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    alignItems: "center",
    width: "25%",
    borderRadius: 10,
    marginLeft: 10,
  },
  userName: {
    fontSize: 28,
    position: "absolute",
    left: 0,
    verticalAlign: "middle",
    paddingTop: 5,
    paddingLeft: 10,
    color: "black",
  },
  dateTime: {
    padding: 10,
    position: "absolute",
    right: 0,
    marginBottom: 5,
  },
  container: {
    flex: 1,
  },
  topView: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  bottomView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  renderItem: {
    padding: 15,
    marginBottom: 7,
    margin: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  listShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "black",
    borderWidth: 2,
  },

  center: {
    paddingTop: "40%",
    alignItems: "center",
    backgroundColor: "#f74449",
  },

  h1: {
    paddingTop: 10,
    alignItems: "center",
  },

  input: {
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#431213",
    color: "white",
  },
  lable: {
    fontSize: 18,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingRight: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  button1: {
    width: 270,
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#ffbf00",
    marginTop: 12,
    justifyContent: "center",
  },
  header: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    position: "absolute",
    top: 0,
    left: 0,
    height: 60,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  blurContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  heading2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    width: "33%", // Adjusting width to fit three columns
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  buttonContainer: {
    marginBottom: 10,
    alignContent: "center",
  },
  button: {
    backgroundColor: "#ffbf00",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
});
