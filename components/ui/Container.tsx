import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps {
    edges?: Edge[];
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export function Container({ children, style, edges }: ContainerProps) {
    if (edges) {
        return (
            <SafeAreaView style={[styles.container, style]} edges={edges}>
                {children}
            </SafeAreaView>
        );
    }
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});